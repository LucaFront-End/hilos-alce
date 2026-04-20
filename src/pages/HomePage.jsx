import { Hero }                  from '../components/sections/Hero';
import { MarqueeBand }           from '../components/sections/MarqueeBand';
import { ProductsAccordion }     from '../components/sections/ProductsAccordion';
import { IndustriesHoverWall }   from '../components/sections/IndustriesHoverWall';
import { TechSpecs }             from '../components/sections/TechSpecs';
import { About }                 from '../components/sections/About';
import { CTAStrip }              from '../components/sections/CTAStrip';
import { ContactSection }        from '../components/sections/Contact';

export function HomePage() {
  return (
    <main>
      <Hero />
      <MarqueeBand />
      <ProductsAccordion />
      <IndustriesHoverWall />
      <TechSpecs />
      <About />
      <CTAStrip />
      <ContactSection />
    </main>
  );
}
