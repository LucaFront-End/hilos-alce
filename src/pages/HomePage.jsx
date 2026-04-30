import { Hero }                  from '../components/sections/Hero';
import { MarqueeBand }           from '../components/sections/MarqueeBand';
import { ProductsAccordion }     from '../components/sections/ProductsAccordion';
import { IndustriesHoverWall }   from '../components/sections/IndustriesHoverWall';
import { TechSpecs }             from '../components/sections/TechSpecs';
import { About }                 from '../components/sections/About';
import { CTAStrip }              from '../components/sections/CTAStrip';
import { ContactSection }        from '../components/sections/Contact';
import { usePageSEO }            from '../hooks/usePageSEO';

export function HomePage() {
  usePageSEO({
    title: 'Hilos Alce | Fábrica de Hilos Industriales de Poliéster de Alta Tenacidad en México',
    description: 'Fabricamos hilo poliéster de alta calidad y multifilamento para industria en todo México. Hilos delgados y gruesos de alta tenacidad para procesos exigentes.',
  });

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
