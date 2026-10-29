export interface Campaign {
  name: string;
  hypothesis: string;
  channel: string;
}

export const CAMPAIGN: Campaign = {
  name: 'Experiment #1 — Bolo, likho mat',
  hypothesis: 'Students who already live on WhatsApp voice notes will try Wispr Flow when a peer shows it working in Hinglish.',
  channel: 'LinkedIn + campus WhatsApp groups, each with its own ?ref= link',
};
