import { useEffect, useState } from 'react';
import { resolveReceipts } from '../../shared/receipts';
import { totalsOf, type Channel, type DayStats } from '../../shared/stats';
import { CAMPAIGN } from '../data/campaign';
import { loadStats, type LiveStats } from '../lib/track';
import { RawStrip } from './RawStrip';
import { ProofList } from './Receipt';

const EVIDENCE = [
  {
    label: 'Partnerships',
    title: 'Electrothon 7.0 and 8.0, with the SPEC team',
    body: 'As a team we brought in speakers and judges and grew a national hackathon’s reach. My part was developer relations — I didn’t call it growth back then.',
    receipts: ['electrothon-7', 'electrothon-8'],
  },
  {
    label: 'Product loop',
    title: '500+ participants on a dashboard I built',
    body: 'Real-time infra monitoring for Electrothon 8.0. Participants gave feedback; we improved and optimised the platform from it.',
    receipts: ['electrothon-8-repo'],
  },
  {
    label: 'Funnel',
    title: 'My own outreach pipeline',
    body: 'Weekly cold outreach to recruiters found on LinkedIn and hiring platforms, handling the replies myself. My first funnel — built for myself.',
    receipts: ['linkedin'],
  },
] as const;

const CHANNEL_LABEL: Record<Channel, string> = {
  linkedin: 'LinkedIn',
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  x: 'X',
  college: 'College groups',
  github: 'GitHub',
  direct: 'Direct',
  other: 'Other',
};

const COUNTER_SOURCE = 'https://github.com/AlgoMasterArpit/whisper_portfolio/blob/main/api/hit.ts';

const percent = (n: number) => `${(n * 100).toFixed(1)}%`;

export function GrowthLab() {
  const [stats, setStats] = useState<LiveStats | null>(null);

  useEffect(() => {
    let alive = true;
    void loadStats().then((s) => {
      if (alive) setStats(s);
    });
    return () => {
      alive = false;
    };
  }, []);

  const days = stats?.days ?? [];
  const sum = totalsOf(days);
  const live = days.length > 0;
  const channels = (Object.entries(sum.channels) as [Channel, number][]).sort((a, b) => b[1] - a[1]);

  return (
    <section id="growth" className="section growth">
      <div className="wrap">
        <div data-reveal>
          <RawStrip question="q7" />
          <p className="kicker">04 — Growth lab</p>
          <h2 className="title">
            I didn’t call it growth <em>back then.</em>
          </h2>
          <p className="lede">
            My best moments weren’t writing code — they were getting things in front of people. Here’s the evidence, an
            idea, and a live experiment.
          </p>
        </div>

        <div className="evidence">
          {EVIDENCE.map((e) => (
            <article className="evidence__card" key={e.title} data-reveal>
              <p className="evidence__label">{e.label}</p>
              <h3>{e.title}</h3>
              <p>{e.body}</p>
              <ProofList receipts={resolveReceipts(e.receipts)} />
            </article>
          ))}
        </div>

        <article className="idea" data-reveal>
          <p className="evidence__label">An idea I’d explore</p>
          <p>
            College hackathons are full of student builders — the people most likely to enjoy building by voice. I’d love
            to explore a student-hackathon partnership for Wispr Flow together with my SPEC team.
          </p>
        </article>

        <article className="experiment" data-reveal>
          <header className="experiment__head">
            <div>
              <p className="evidence__label">{live ? `Live · ${days.length} day${days.length > 1 ? 's' : ''}` : 'Counter is on'}</p>
              <h3>{CAMPAIGN.name}</h3>
            </div>
            <dl className="experiment__meta">
              <div>
                <dt>Hypothesis</dt>
                <dd>{CAMPAIGN.hypothesis}</dd>
              </div>
              <div>
                <dt>Channel</dt>
                <dd>{CAMPAIGN.channel}</dd>
              </div>
            </dl>
          </header>

          <div className="tiles">
            <Tile label="Visitors" value={sum.visitors.toLocaleString('en-IN')} />
            <Tile label="Tried Wispr Flow" value={sum.wisprClicks.toLocaleString('en-IN')} />
            <Tile label="Click rate" value={live ? percent(sum.clickRate) : '—'} />
          </div>

          {live ? (
            <>
              <DailyVisitors days={days} />
              {channels.length > 0 && (
                <p className="channels">
                  {channels.map(([c, n]) => (
                    <span key={c}>
                      {CHANNEL_LABEL[c]} <strong>{n}</strong>
                    </span>
                  ))}
                </p>
              )}
            </>
          ) : (
            <p className="experiment__empty">Numbers appear here on their own as people visit — including the flops.</p>
          )}

          <div className="experiment__foot">
            <a className="btn btn--ink" href="/api/go?to=wispr" target="_blank" rel="noopener">
              Try Wispr Flow ↗
            </a>
            <p className="experiment__proof">
              Counted live and anonymously by this site — not typed by me.{' '}
              <a href="/api/stats" target="_blank" rel="noopener">
                Raw numbers ↗
              </a>{' '}
              ·{' '}
              <a href={COUNTER_SOURCE} target="_blank" rel="noreferrer">
                Counter code ↗
              </a>
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="tile">
      <p className="tile__value">{value}</p>
      <p className="tile__label">{label}</p>
    </div>
  );
}

const W = 640;
const H = 200;
const PAD = { top: 16, right: 8, bottom: 28, left: 32 };

export function DailyVisitors({ days }: { days: readonly DayStats[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...days.map((d) => d.visitors));
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const slot = plotW / days.length;
  const barW = Math.min(36, slot - 2);
  const ticks = [...new Set([0, Math.ceil(max / 2), max])];
  const active = hover === null ? null : days[hover];
  const label = (d: DayStats) =>
    new Date(`${d.date}T00:00:00+05:30`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  return (
    <figure className="chart">
      <figcaption className="chart__title">Visitors per day</figcaption>
      <div className="chart__plot">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Visitors per day over ${days.length} days, peak ${max}`}>
          {ticks.map((t) => {
            const y = PAD.top + plotH - (t / max) * plotH;
            return (
              <g key={t} className="chart__grid">
                <line x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} />
                <text x={PAD.left - 8} y={y} dy="0.32em" textAnchor="end">
                  {t}
                </text>
              </g>
            );
          })}
          {days.map((d, i) => {
            const h = (d.visitors / max) * plotH;
            const x = PAD.left + i * slot + (slot - barW) / 2;
            const y = PAD.top + plotH - h;
            return (
              <g key={d.date}>
                <path
                  className={`chart__bar ${hover === i ? 'is-hover' : ''}`}
                  d={h > 0 ? `M${x},${PAD.top + plotH}V${y + 4}q0,-4 4,-4h${barW - 8}q4,0 4,4V${PAD.top + plotH}Z` : ''}
                />
                <rect
                  x={PAD.left + i * slot}
                  y={PAD.top}
                  width={slot}
                  height={plotH}
                  fill="transparent"
                  onPointerEnter={() => setHover(i)}
                  onPointerLeave={() => setHover(null)}
                />
                {(i === 0 || i === days.length - 1 || days.length <= 8) && (
                  <text className="chart__x" x={PAD.left + i * slot + slot / 2} y={H - 8} textAnchor="middle">
                    {label(d)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        {active && hover !== null && (
          <div className="chart__tip" style={{ left: `${((PAD.left + (hover + 0.5) * slot) / W) * 100}%` }}>
            <strong>{label(active)}</strong>
            <span>{active.visitors} visitors</span>
            <span>{active.wisprClicks} tried Wispr Flow</span>
          </div>
        )}
      </div>
      <details className="chart__table">
        <summary>Show as table</summary>
        <table>
          <thead>
            <tr>
              <th scope="col">Day</th>
              <th scope="col">Visitors</th>
              <th scope="col">Visits</th>
              <th scope="col">Tried Wispr</th>
            </tr>
          </thead>
          <tbody>
            {days.map((d) => (
              <tr key={d.date}>
                <td>{label(d)}</td>
                <td>{d.visitors}</td>
                <td>{d.visits}</td>
                <td>{d.wisprClicks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
