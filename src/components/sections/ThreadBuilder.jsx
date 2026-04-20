import { useState, useMemo } from 'react';
import { Settings, Droplet, Package, Send, CheckCircle2 } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

export function ThreadBuilder({ product }) {
  const ref = useScrollReveal();
  
  const parseCalibers = () => {
    let raw = product.specs[0].label;
    if (raw.includes('Calibres:')) raw = raw.replace('Calibres:', '');
    return raw.split(',').map(c => c.trim());
  };
  const calibers = parseCalibers();
  const weights = ['125g', '450g', '1kg', '2kg', '4kg'];

  const [selectedColor, setSelectedColor] = useState(product.swatches[0]);
  const [selectedCaliber, setSelectedCaliber] = useState(calibers[0]);
  const [selectedWeight, setSelectedWeight] = useState('1kg');
  
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // --- FÍSICAS DINÁMICAS ---
  // Mapear Peso a Escala (X e Y)
  const spoolTransform = useMemo(() => {
    const w = selectedWeight;
    if (w === '125g') return 'scaleX(0.7) scaleY(0.7)';
    if (w === '450g') return 'scaleX(0.85) scaleY(0.85)';
    if (w === '1kg')  return 'scaleX(1) scaleY(1)';
    if (w === '2kg')  return 'scaleX(1.3) scaleY(1.15)';
    if (w === '4kg')  return 'scaleX(1.8) scaleY(1.3)';
    return 'scaleX(1) scaleY(1)';
  }, [selectedWeight]);

  // Mapear Calibre a Textura (Repeating Gradient Gap)
  const threadTextureStr = useMemo(() => {
    const thick = selectedCaliber.includes('1000') || selectedCaliber.includes('Grueso');
    const gap = thick ? 12 : 4;
    return `repeating-linear-gradient(90deg, transparent, transparent ${gap}px, rgba(255,255,255,0.15) ${gap}px, rgba(255,255,255,0.15) ${thick ? gap*2 : gap*2}px)`;
  }, [selectedCaliber]);

  const handleSub = (e) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setTimeout(() => setIsSent(false), 4000);
    }, 1500);
  };

  return (
    <section className="builder-section" ref={ref}>
      <div className="container">
        <div className="builder-header reveal">
          <h2 className="t-title" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}>Estudio de Configuración</h2>
          <p className="t-desc">Arma y visualiza tu bobina en tiempo real. Alta precisión técnica.</p>
        </div>

        <div className="builder-grid reveal delay-1">
          {/* Lado A: Live Preview Panel */}
          <div className="builder-preview">
            <div className="builder-preview-inner">
              <div className="bp-spool-graphic" style={{ transform: spoolTransform, transition: 'transform 0.6s cubic-bezier(0.3, 1.5, 0.4, 1)' }}>
                <div className="bp-spool-top" />
                <div className="bp-spool-thread" style={{ 
                  backgroundColor: selectedColor,
                  backgroundImage: threadTextureStr,
                  boxShadow: `inset 15px 0 30px rgba(0,0,0,0.5), inset -10px 0 20px rgba(255,255,255,0.2)`
                }} />
                <div className="bp-spool-bottom" />
              </div>

              <div className="bp-receipt">
                <div className="bp-receipt-row">
                  <span className="bp-receipt-lbl">Línea:</span>
                  <span className="bp-receipt-val">{product.title}</span>
                </div>
                <div className="bp-receipt-row">
                  <span className="bp-receipt-lbl">Pigmento:</span>
                  <span className="bp-receipt-val" style={{ color: selectedColor, filter: 'brightness(1.5)' }}>{selectedColor}</span>
                </div>
                <div className="bp-receipt-row">
                  <span className="bp-receipt-lbl">Estructura:</span>
                  <span className="bp-receipt-val">{selectedCaliber}</span>
                </div>
                <div className="bp-receipt-row">
                  <span className="bp-receipt-lbl">Suministro:</span>
                  <span className="bp-receipt-val">{selectedWeight} unit</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lado B: Configurador */}
          <form className="builder-controls" onSubmit={handleSub}>
            
            <div className="bc-group">
              <div className="bc-header">
                <Droplet size={18} strokeWidth={2} />
                <label>1. Tono Fotométrico</label>
              </div>
              <div className="bc-colors" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {product.swatches.map(color => (
                  <button
                    key={color} type="button" aria-label={`Color ${color}`}
                    className={`bc-color-btn ${selectedColor === color ? 'bc-color-btn--active' : ''}`}
                    style={{ background: color }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>

            <div className="bc-group">
              <div className="bc-header">
                <Settings size={18} strokeWidth={2} />
                <label>2. Calibre Técnico</label>
              </div>
              <div className="bc-pills">
                {calibers.map(cal => (
                  <button
                    key={cal} type="button"
                    className={`bc-pill ${selectedCaliber === cal ? 'bc-pill--active' : ''}`}
                    onClick={() => setSelectedCaliber(cal)}
                  >
                    {cal}
                  </button>
                ))}
              </div>
            </div>

            <div className="bc-group">
              <div className="bc-header">
                <Package size={18} strokeWidth={2} />
                <label>3. Volumen de Presentación</label>
              </div>
              <div className="bc-pills">
                {weights.map(w => (
                  <button
                    key={w} type="button"
                    className={`bc-pill ${selectedWeight === w ? 'bc-pill--active' : ''}`}
                    onClick={() => setSelectedWeight(w)}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            <div className="bc-divider" />

            <div className="bc-group">
              <label className="bc-label">Procesar Modelo</label>
              <div className="form-row">
                <input required type="text" placeholder="Nombre completo" className="form-input" />
                <input required type="email" placeholder="Correo corporativo" className="form-input" />
              </div>
            </div>

            <button type="submit" className="btn btn--accent btn--lg" disabled={isSending} style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}>
              {isSending ? 'Compilando modelo...' : isSent ? 'Modelo Procesado' : 'Generar Cotización B2B'}
              {isSent ? <CheckCircle2 size={18} /> : <Send size={18} />}
            </button>
            
            {isSent && (
              <div style={{ marginTop: '1rem', color: 'var(--accent)', fontSize: '0.85rem', textAlign: 'center', fontWeight: '500' }}>
                Tu configuración ha sido enrutada al área comercial.
              </div>
            )}
            
          </form>
        </div>
      </div>
    </section>
  );
}
