// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { App } from '../src/App';
import { AskArpit } from '../src/components/AskArpit';
import { DailyInstalls } from '../src/components/GrowthLab';
import { SCENES } from '../src/data/story';

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = () => null;
  Element.prototype.scrollIntoView = () => {};
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe('App', () => {
  it('renders every section', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('Don’t trust my resume.');
    for (const id of ['ask', 'ledger', 'museum', 'growth', 'game', 'tape']) {
      expect(document.getElementById(id), id).not.toBeNull();
    }
  });

  it('shows raw takes when raw mode is switched on, by click or by key', () => {
    render(<App />);
    expect(document.querySelectorAll('.raw-strip')).toHaveLength(0);
    fireEvent.click(screen.getByRole('button', { name: /shipped/i }));
    expect(document.querySelectorAll('.raw-strip').length).toBeGreaterThan(3);
    fireEvent.keyDown(window, { key: 'r' });
    expect(document.querySelectorAll('.raw-strip')).toHaveLength(0);
  });

  it('prints an answer with its stamp', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json({ text: 'Because people.', receipts: [], verdict: 'no-receipt', source: 'twin' })),
    );
    render(<App />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Why should a developer do growth?' }));
    });
    const printer = document.querySelector('.printer') as HTMLElement;
    expect(within(printer).getByText('Because people.')).toBeTruthy();
    expect(within(printer).getByText('No receipt')).toBeTruthy();
  });

  it('ignores the keyboard shortcuts while typing a question', () => {
    render(<App />);
    fireEvent.keyDown(screen.getByLabelText('Your question'), { key: 'r' });
    expect(document.querySelectorAll('.raw-strip')).toHaveLength(0);
  });
});

describe('Museum', () => {
  it('reveals my call and walks to the final score', () => {
    render(<App />);
    const museum = document.getElementById('museum')!;
    for (const scene of SCENES) {
      fireEvent.click(within(museum).getByRole('button', { name: new RegExp(scene.options[scene.actual]) }));
      expect(within(museum).getByText('Same call as me.')).toBeTruthy();
      fireEvent.click(within(museum).getByRole('button', { name: /next exhibit|see how you did/i }));
    }
    expect(within(museum).getByText(`You made ${SCENES.length} of ${SCENES.length} calls the way I did.`)).toBeTruthy();
  });
});

describe('Spot the fake', () => {
  it('scores a correct pick and stamps the fake', () => {
    render(<App />);
    const game = document.getElementById('game')!;
    fireEvent.click(within(game).getByRole('button', { name: /Meta ads/ }));
    expect(within(game).getByText('Caught it.')).toBeTruthy();
    expect(within(game).getByText(/score 1/)).toBeTruthy();
  });
});

describe('DailyInstalls', () => {
  it('draws one bar per day and offers a table view', () => {
    const days = [
      { date: '2026-10-30', reach: 100, installs: 4 },
      { date: '2026-10-31', reach: 150, installs: 9, note: 'reel went out' },
    ];
    const { container } = render(<DailyInstalls days={days} />);
    expect(container.querySelectorAll('.chart__bar')).toHaveLength(2);
    expect(container.querySelectorAll('tbody tr')).toHaveLength(2);
    expect(screen.getByText('reel went out')).toBeTruthy();
  });
});

describe('Spoken answers', () => {
  it('reads the new answer aloud once the switch is on', async () => {
    const spoken: string[] = [];
    vi.stubGlobal('speechSynthesis', {
      cancel() {},
      getVoices: () => [{ lang: 'en-IN', name: 'Microsoft Neerja Online (Natural)' }],
      speak: (u: { text: string }) => spoken.push(u.text),
    });
    vi.stubGlobal(
      'SpeechSynthesisUtterance',
      class {
        constructor(public text: string) {}
      },
    );
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json({ text: 'Spoken reply.', receipts: [], verdict: 'no-receipt', source: 'twin' })),
    );
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /read answers aloud/i }));
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'What would you do on day one?' }));
    });
    await waitFor(() => expect(spoken).toEqual(['Spoken reply.']));
    fireEvent.click(screen.getByRole('button', { name: /▶ read aloud/i }));
    await waitFor(() => expect(spoken).toEqual(['Spoken reply.', 'Spoken reply.']));
  });
});

describe('Keyboard', () => {
  it('opens the voice-command help with ?', () => {
    render(<App />);
    const dialog = document.querySelector('dialog.help') as HTMLDialogElement;
    dialog.showModal ??= function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    };
    fireEvent.keyDown(window, { key: '?' });
    expect(dialog.hasAttribute('open')).toBe(true);
  });

  it('ignores shortcuts pressed with a modifier', () => {
    render(<App />);
    fireEvent.keyDown(window, { key: 'r', ctrlKey: true });
    expect(document.querySelectorAll('.raw-strip')).toHaveLength(0);
  });

  it('moves focus to the next exhibit so keyboard users keep their place', () => {
    render(<App />);
    const museum = document.getElementById('museum')!;
    fireEvent.click(within(museum).getAllByRole('button', { name: /^[AB]/ })[0]!);
    fireEvent.click(within(museum).getByRole('button', { name: /next exhibit/i }));
    expect(document.activeElement?.textContent).toBe(SCENES[1]!.title);
  });

  it('says the mic is blocked instead of failing silently', async () => {
    vi.stubGlobal('navigator', { ...navigator, mediaDevices: { getUserMedia: () => Promise.reject(new Error('denied')) } });
    render(<App />);
    await act(async () => {
      fireEvent.keyDown(window, { key: 'v' });
    });
    expect(screen.getByText(/mic is blocked/i)).toBeTruthy();
  });
});

describe('Troy voice', () => {
  it('plays the server voice and skips the robotic browser voice when audio comes back', async () => {
    const played: string[] = [];
    const browserSpoke: string[] = [];
    vi.stubGlobal('speechSynthesis', { cancel() {}, getVoices: () => [], speak: (u: { text: string }) => browserSpoke.push(u.text) });
    vi.stubGlobal('SpeechSynthesisUtterance', class {});
    vi.stubGlobal(
      'Audio',
      class {
        constructor(public src: string) {}
        pause() {}
        play() {
          played.push(this.src);
          return Promise.resolve();
        }
      },
    );
    vi.stubGlobal('URL', Object.assign(Object.create(URL), { createObjectURL: () => 'blob:troy' }));
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) =>
        url === '/api/speak'
          ? new Response(new Uint8Array([1, 2]), { headers: { 'content-type': 'audio/wav' } })
          : Response.json({ text: 'Troy here.', receipts: [], verdict: 'no-receipt', source: 'twin' }),
      ),
    );
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /read answers aloud/i }));
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Sabse bada risk kya liya?' }));
    });
    await waitFor(() => expect(played).toEqual(['blob:troy']));
    expect(browserSpoke).toEqual([]);
  });
});

describe('Voice in, voice out', () => {
  it('speaks the answer to a spoken question even with read-aloud off', async () => {
    const spoken: string[] = [];
    vi.stubGlobal('speechSynthesis', {
      cancel() {},
      getVoices: () => [{ lang: 'en-IN', name: 'Natural' }],
      speak: (u: { text: string }) => spoken.push(u.text),
    });
    vi.stubGlobal('SpeechSynthesisUtterance', class {
      constructor(public text: string) {}
    });
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 503 })));
    const entries = [{ id: 1, question: 'rate me', voice: true, answer: { text: 'Seven out of ten.', receipts: [], verdict: 'self-reported' as const, source: 'twin' as const } }];
    render(
      <AskArpit entries={entries} busy={false} onAsk={() => {}} dictating={false} interim="" onDictate={() => {}} onStopDictate={() => {}} speakOn={false} onSpeak={() => {}} />,
    );
    await waitFor(() => expect(spoken).toEqual(['Seven out of ten.']));
  });

  it('stays quiet for typed questions while read-aloud is off', async () => {
    const spoken: string[] = [];
    vi.stubGlobal('speechSynthesis', { cancel() {}, getVoices: () => [], speak: (u: { text: string }) => spoken.push(u.text) });
    const entries = [{ id: 1, question: 'typed', answer: { text: 'Quiet.', receipts: [], verdict: 'no-receipt' as const, source: 'twin' as const } }];
    render(
      <AskArpit entries={entries} busy={false} onAsk={() => {}} dictating={false} interim="" onDictate={() => {}} onStopDictate={() => {}} speakOn={false} onSpeak={() => {}} />,
    );
    await new Promise((r) => setTimeout(r, 50));
    expect(spoken).toEqual([]);
  });
});
