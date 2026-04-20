import { marqueeItems } from '../../data/content';

const items = [...marqueeItems, ...marqueeItems];

export function MarqueeBand() {
  return (
    <div className="marquee-band" aria-hidden="true">
      <div className="marquee-band__track">
        {items.map((item, i) => (
          <div key={i} className="marquee-band__item">
            <span>{item}</span>
            <span className="marquee-band__sep">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
