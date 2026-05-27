/**
 * Marquee top bar — rotating brand statements above the header.
 * CSS-only animation for performance (no JS, no Framer for this one).
 * The track is duplicated so the -50% translateX in the keyframe loops
 * without a visible seam.
 */
const ITEMS = [
  'Livraison offerte dès 2 paires',
  '👄',
  'Fait à Vila Nova de Famalicão',
  '👄',
  '22 € la paire',
  '👄',
  'Pour le Reformer, le tapis, et le café d’après',
  '👄',
  'Retours 30 jours',
  '👄',
];

export default function MarqueeTop() {
  // Render the items twice in the track so the -50% loop is seamless.
  const track = [...ITEMS, ...ITEMS];

  return (
    <div
      aria-hidden
      className="relative z-50 overflow-hidden border-b border-ink/10 bg-rouge text-cream"
    >
      <div className="animate-marquee marquee-track py-1.5">
        {track.map((label, i) => (
          <span
            key={i}
            className="inline-flex items-center px-4 font-mono text-[0.65rem] uppercase tracking-[0.2em]"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
