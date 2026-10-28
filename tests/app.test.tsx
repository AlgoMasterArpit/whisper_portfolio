// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { App } from '../src/App';
import { DailyInstalls } from '../src/components/GrowthLab';
import { SCENES } from '../src/data/story';

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = () => null;
  Element.prototype.scrollIntoView = () => {};
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
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
