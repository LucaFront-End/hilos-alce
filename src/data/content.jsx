// src/data/content.jsx
// Data proxy — ready for Wix Headless SDK injection
import { 
  Factory, Palette, Disc3, Settings2, Scissors, 
  Car, Shell, Armchair, Tent, Briefcase, 
  Settings, Microscope, Zap, Handshake 
} from 'lucide-react';
export const siteMeta = {
  name: 'Hilos Alce',
  tagline: 'Alta Tenacidad Industrial',
  phone: '55 1002 2544',
  whatsapp: '5215510022544',
  email: 'ventas@hilosalce.mx',
  address: 'Av. San Lorenzo 279, Cerro de la Estrella, Iztapalapa, CDMX',
};

export const heroContent = {
  eyebrow: 'Fabricación & Distribución',
  title1: 'Hilos de',
  title2: 'Alta Tenacidad',
  subtitle:
    'Fabricamos hilos industriales de poliéster para las industrias más exigentes. Precisión, resistencia y desempeño técnico en cada bobina.',
  ctaPrimary: 'Cotizar Ahora',
  ctaSecondary: 'Ver Catálogo',
  stats: [
    { num: '+30', label: 'Colores disponibles' },
    { num: '12', label: 'Calibres y formatos' },
    { num: '100%', label: 'Poliéster alta tenacidad' },
  ],
  badge1: { icon: <Factory size={18} strokeWidth={1.5} />, text: 'Fabricación propia' },
  badge2: { icon: <Palette size={18} strokeWidth={1.5} />, text: '+30 colores en stock' },
};

export const marqueeItems = [
  '100% Poliéster',
  'Alta Tenacidad',
  '+30 Colores',
  'Resistencia UV',
  'Termofijado',
  'Bajo Coef. de Fricción',
  'Anti-Abrasión',
  'Resistencia Química',
  'Elongación 12–22%',
  'Costura Industrial',
];

export const productLines = [
  {
    id: 'delgados',
    slug: 'hilos-delgados',
    tag: 'Línea 1',
    icon: <Disc3 size={32} strokeWidth={1.2} />,
    title: 'Hilos Delgados',
    subtitle: 'Alta Tenacidad',
    description:
      'Fibra continua de poliéster de alta tenacidad para costuras técnicas que demandan precisión y resistencia extrema.',
    color: 'red',
    specs: [
      { label: 'Calibres: #8, #30, #0, #00' },
      { label: 'Presentaciones: 125g | 450g | 1kg | 2kg | 4kg' },
      { label: 'Composición: 100% Poliéster' },
      { label: '+30 colores disponibles' },
    ],
    swatches: [
      '#E74C3C','#3498DB','#2ECC71','#F39C12','#9B59B6',
      '#1ABC9C','#E67E22','#2C3E50','#E91E63','#00BCD4',
      '#F1C40F','#795548','#607D8B','#FF5722','#009688',
      '#3F51B5',
    ],
    applications: [
      'Industria textil', 'Automotriz & Airbags', 'Calzado industrial', 'Equipo de seguridad',
    ],
    bgNum: '01',
  },
  {
    id: 'gruesos',
    slug: 'hilos-gruesos',
    tag: 'Línea 2',
    icon: <Settings2 size={32} strokeWidth={1.2} />,
    title: 'Hilos Gruesos',
    subtitle: 'Alta Tenacidad',
    description:
      'Hilos industriales de gran calibre para aplicaciones de alta carga. Ideal para tapicería, lonas, marroquinería y calzado industrial.',
    color: 'blue',
    specs: [
      { label: 'Calibres: 1000/2 al 1000/9' },
      { label: 'Presentaciones: 125g | 450g | 1kg | 2kg | 4kg' },
      { label: 'Colores: Blanco & Negro (especiales p/pedido)' },
      { label: 'Resistencia a químicos y abrasión' },
    ],
    swatches: ['#0D0D0D', '#F5F5F5'],
    applications: [
      'Tapicería industrial', 'Lonas & Carpas', 'Marroquinería & Cuero', 'Calzado industrial',
    ],
    bgNum: '02',
  },
];

export const industries = [
  {
    id: 'textil',
    name: 'Industria Textil',
    icon: <Scissors size={24} strokeWidth={1.5} />,
    shortName: 'Textil',
    description: 'Hilos de alta tenacidad para ropa de trabajo, tejidos técnicos y textiles de alta performance.',
    applications: ['Ropa de Trabajo', 'Tejidos Técnicos', 'Uniformes Industriales'],
    visClass: 'ind-vis-textile',
    num: '01',
    lineas: ['Delgados'],
  },
  {
    id: 'automotriz',
    name: 'Industria Automotriz',
    icon: <Car size={24} strokeWidth={1.5} />,
    shortName: 'Automotriz',
    description: 'Costura de tapicería, fabricación de airbags y cinturones de seguridad en entornos de producción en serie.',
    applications: ['Tapicería', 'Airbags', 'Cinturones de Seguridad'],
    visClass: 'ind-vis-auto',
    num: '02',
    lineas: ['Delgados', 'Gruesos'],
  },
  {
    id: 'calzado',
    name: 'Calzado Industrial',
    icon: <Shell size={24} strokeWidth={1.5} />,
    shortName: 'Calzado',
    description: 'Costuras y refuerzos estructurales en calzado de seguridad, deportivo e industrial.',
    applications: ['Costuras Estructurales', 'Refuerzos', 'Jareta para calzado'],
    visClass: 'ind-vis-calzado',
    num: '03',
    lineas: ['Delgados', 'Gruesos'],
  },
  {
    id: 'tapiceria',
    name: 'Tapicería Industrial',
    icon: <Armchair size={24} strokeWidth={1.5} />,
    shortName: 'Tapicería',
    description: 'Hilos gruesos de alta resistencia para mueblería industrial, tapizado de interiores y asientos.',
    applications: ['Mueblería', 'Asientos Industriales', 'Tapizado Interior'],
    visClass: 'ind-vis-tapiz',
    num: '04',
    lineas: ['Gruesos'],
  },
  {
    id: 'lonas',
    name: 'Lonas & Carpas',
    icon: <Tent size={24} strokeWidth={1.5} />,
    shortName: 'Lonas',
    description: 'Costura de alta resistencia para lonas, carpas industriales, toldos y estructuras tensionadas.',
    applications: ['Lonas Industriales', 'Carpas de Evento', 'Estructuras Tensionadas'],
    visClass: 'ind-vis-lonas',
    num: '05',
    lineas: ['Gruesos'],
  },
  {
    id: 'marroquineria',
    name: 'Marroquinería & Cuero',
    icon: <Briefcase size={24} strokeWidth={1.5} />,
    shortName: 'Marroquinería',
    description: 'Costuras decorativas y funcionales en artículos de cuero, piel, bolsos, cinturones y accesorios de moda.',
    applications: ['Bolsos & Carteras', 'Cinturones', 'Accesorios de Cuero'],
    visClass: 'ind-vis-marroq',
    num: '06',
    lineas: ['Gruesos'],
  },
];

export const techSpecs = {
  props: [
    { val: '12–22', unit: '%', label: 'Elongación', desc: 'Perfecta relación tracción-elasticidad para costuras industriales de alto ciclo.' },
    { val: 'UV+', unit: '', label: 'Resistencia UV', desc: 'Estabilidad de color y resistencia estructural ante exposición solar prolongada.' },
    { val: '< 0.2', unit: 'μk', label: 'Coef. de Fricción', desc: 'Bajo coeficiente para costura a alta velocidad sin quemado de hilo.' },
    { val: '100%', unit: '', label: 'Poliéster', desc: 'Fibra continua de alta tenacidad, pre-estabilizada térmicamente.' },
    { val: '6+', unit: '', label: 'Calibres Gruesos', desc: '1000/2, 1000/3, 1000/4, 1000/5, 1000/6, 1000/9.' },
    { val: 'Anti', unit: '', label: 'Químicos & Abrasión', desc: 'Resistencia comprobada a aceites, solventes y abrasión mecánica.' },
  ],
  tables: [
    {
      title: 'Hilos Delgados',
      badge: 'Línea 1',
      rows: [
        { caliber: 'Tkt #8', presets: ['125g', '450g', '1kg', '2kg', '4kg'] },
        { caliber: 'Tkt #30', presets: ['125g', '450g', '1kg', '2kg', '4kg'] },
        { caliber: 'Tkt #0', presets: ['125g', '450g', '1kg', '2kg', '4kg'] },
        { caliber: 'Tkt #00', presets: ['125g', '450g', '1kg', '2kg', '4kg'] },
      ],
    },
    {
      title: 'Hilos Gruesos',
      badge: 'Línea 2',
      rows: [
        { caliber: '1000/2', presets: ['125g', '450g', '1kg', '2kg', '4kg'] },
        { caliber: '1000/3', presets: ['125g', '450g', '1kg', '2kg', '4kg'] },
        { caliber: '1000/4', presets: ['125g', '450g', '1kg', '2kg', '4kg'] },
        { caliber: '1000/5', presets: ['125g', '450g', '1kg', '2kg', '4kg'] },
        { caliber: '1000/6', presets: ['125g', '450g', '1kg', '2kg', '4kg'] },
        { caliber: '1000/9', presets: ['125g', '450g', '1kg', '2kg', '4kg'] },
      ],
    },
  ],
};

export const aboutContent = {
  eyebrow: 'Sobre Nosotros',
  title: 'Fabricación con propósito técnico',
  description:
    'Hilos Alce nació de la necesidad de contar con un proveedor confiable de hilos industriales en México. Hoy somos referencia en la fabricación y distribución de hilos de alta tenacidad para los sectores más exigentes.',
  values: [
    { icon: <Settings size={28} strokeWidth={1.2} />, title: 'Precisión Técnica', desc: 'Cada hilo es producido bajo estrictos estándares de calibrado y resistencia.' },
    { icon: <Microscope size={28} strokeWidth={1.2} />, title: 'Alta Tenacidad', desc: 'Fibra continua de poliéster termofijada para desempeño máximo en costura industrial.' },
    { icon: <Zap size={28} strokeWidth={1.2} />, title: 'Respuesta Rápida', desc: 'Stock permanente en las principales presentaciones para entrega inmediata.' },
    { icon: <Handshake size={28} strokeWidth={1.2} />, title: 'Relación B2B', desc: 'Trabajamos directamente con maquiladoras, diseñadores y fabricantes a escala.' },
  ],
  fiberColors: [
    { color: '#E74C3C', label: 'Rojo' }, { color: '#3498DB', label: 'Azul' },
    { color: '#2ECC71', label: 'Verde' }, { color: '#F39C12', label: 'Naranja' },
    { color: '#9B59B6', label: 'Morado' }, { color: '#1ABC9C', label: 'Teal' },
    { color: '#E67E22', label: 'Sienna' }, { color: '#2C3E50', label: 'Marino' },
  ],
};
