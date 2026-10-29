import { useState } from 'react';
import { resolveReceipts } from '../../shared/receipts';
import { CAMPAIGN, dayNumber, totals, type CampaignDay } from '../data/campaign';
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

const percent = (n: number) => `${(n * 100).toFixed(1)}%`;

export function GrowthLab() {
  const day = dayNumber(CAMPAIGN.startsOn, new Date());
  const sum = totals(CAMPAIGN.days);
  const launched = CAMPAIGN.days.length > 0;

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
            offer, and a live experiment.
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
              <p className="evidence__label">{launched ? `Live · day ${Math.max(1, day)}` : 'Pre-launch'}</p>
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
            <Tile label="Reached" value={sum.reach.toLocaleString('en-IN')} />
            <Tile label="Installed" value={sum.installs.toLocaleString('en-IN')} />
            <Tile label="Conversion" value={launched ? percent(sum.conversion) : '—'} />
          </div>

          {launched ? (
            <DailyInstalls days={CAMPAIGN.days} />
          ) : (
            <p className="experiment__empty">
              Launches {new Date(`${CAMPAIGN.startsOn}T00:00:00+05:30`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}. Real numbers land
              here every day — including the flops.
            </p>
          )}
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

export function DailyInstalls({ days }: { days: readonly CampaignDay[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...days.map((d) => d.installs));
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;
  const slot = plotW / days.length;
  const barW = Math.min(36, slot - 2);
  const ticks = [0, Math.ceil(max / 2), max];
  const active = hover === null ? null : days[hover];
  const label = (d: CampaignDay) =>
    new Date(`${d.date}T00:00:00+05:30`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  return (
    <figure className="chart">
      <figcaption className="chart__title">Installs per day</figcaption>
      <div className="chart__plot">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Installs per day over ${days.length} days, peak ${max}`}>
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
            const h = (d.installs / max) * plotH;
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
            <span>{active.installs} installs</span>
            <span>{active.reach} reached</span>
            {active.note && <em>{active.note}</em>}
          </div>
        )}
      </div>
      <details className="chart__table">
        <summary>Show as table</summary>
        <table>
          <thead>
            <tr>
              <th scope="col">Day</th>
              <th scope="col">Reached</th>
              <th scope="col">Installed</th>
              <th scope="col">Note</th>
            </tr>
          </thead>
          <tbody>
            {days.map((d) => (
              <tr key={d.date}>
                <td>{label(d)}</td>
                <td>{d.reach}</td>
                <td>{d.installs}</td>
                <td>{d.note ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
