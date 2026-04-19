import React, { useState, useRef, useEffect } from 'react';
import { Upload, Heart, X, Sparkles, Menu, LogOut, ArrowLeft, Check, Loader2, Zap, Car as CarIcon, Mail, Lock, Phone, User } from 'lucide-react';

const C = {
  bg: '#0a0a0a',
  bgCard: '#1a1a1a',
  bgElev: '#222',
  border: 'rgba(255,255,255,0.08)',
  text: '#f5f5f0',
  dim: '#9a9a94',
  accent: '#d4ff4a',
  hot: '#ff4e2f',
  warm: '#ffb949',
  cool: '#5adcff',
};

const SEED_CARS = [
  {
    id: '1', brand: 'BMW', model: '320i M Sport', year: 2020, type: 'Sedan',
    color: 'Alpine White', condition: 'Excellent', km: 68000, owners: 2,
    priceTakassiz: 42000, priceTakasli: 39500,
    features: ['Leather seats', 'Sunroof', 'M Sport package', 'LED headlights'],
    hasAccidents: false, accidentDesc: '',
    location: 'Girne',
    seller: { name: 'Mehmet K.', initials: 'MK', joined: '2023' },
    photos: ['/images/bmw-320i-1.jpg', '/images/bmw-320i-2.jpg', '/images/bmw-320i-3.jpg'],
  },
  {
    id: '2', brand: 'Toyota', model: 'Hilux Invincible', year: 2021, type: 'Pickup',
    color: 'Matte Black', condition: 'Excellent', km: 45000, owners: 1,
    priceTakassiz: 58000, priceTakasli: 55000,
    features: ['4WD', 'Rollbar', 'Bed liner', 'Tow bar'],
    hasAccidents: false, accidentDesc: '',
    location: 'Lefkoşa',
    seller: { name: 'Axel T.', initials: 'AT', joined: '2024' },
    photos: ['/images/hilux-1.jpg', '/images/hilux-2.jpg', '/images/hilux-3.jpg'],
  },
  {
    id: '3', brand: 'Range Rover', model: 'Sport HSE', year: 2019, type: 'SUV',
    color: 'Santorini Black', condition: 'Good', km: 92000, owners: 2,
    priceTakassiz: 65000, priceTakasli: 62000,
    features: ['Air suspension', 'Panoramic roof', 'Meridian sound'],
    hasAccidents: true,
    accidentDesc: 'Minor rear bumper repair (2022), professionally repaired',
    location: 'Magusa',
    seller: { name: 'Sinan G.', initials: 'SG', joined: '2022' },
    photos: ['/images/rangerover-1.jpg', '/images/rangerover-2.jpg', '/images/rangerover-3.jpg'],
  },
  {
    id: '4', brand: 'Volkswagen', model: 'Golf GTI', year: 2022, type: 'Hatchback',
    color: 'Tornado Red', condition: 'Excellent', km: 28000, owners: 1,
    priceTakassiz: 38000, priceTakasli: 36000,
    features: ['DSG', 'DCC suspension', 'Virtual cockpit', 'Harman Kardon'],
    hasAccidents: false, accidentDesc: '',
    location: 'Girne',
    seller: { name: 'Deniz O.', initials: 'DO', joined: '2024' },
    photos: ['/images/golf-gti-1.jpg', '/images/golf-gti-2.jpg', '/images/golf-gti-3.jpg'],
  },
];

const BRANDS = ['BMW', 'Mercedes', 'Audi', 'Toyota', 'Honda', 'Ford', 'Volkswagen', 'Hyundai', 'Nissan', 'Range Rover'];

export default function TomoFil() {
  const [screen, setScreen] = useState('browse');
  const [user, setUser] = useState(null);
  const [cars, setCars] = useState(SEED_CARS);
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [likes, setLikes] = useState(new Set());
  const [menuOpen, setMenuOpen] = useState(false);

  const selectedCar = cars.find(c => c.id === selectedCarId);

  useEffect(() => {
    const saved = localStorage.getItem('tomofil_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('tomofil_user');
    setScreen('browse');
  };

  if (!user) {
    return (
      <div style={{ background: C.bg, color: C.text, minHeight: '100vh', fontFamily: "'Bricolage Grotesque', system-ui" }}>
        {screen === 'login' ? (
          <LoginScreen onSwitch={() => setScreen('signup')} onLogin={(userData) => { setUser(userData); localStorage.setItem('tomofil_user', JSON.stringify(userData)); setScreen('browse'); }} />
        ) : (
          <SignupScreen onSwitch={() => setScreen('login')} onSignup={(userData) => { setUser(userData); localStorage.setItem('tomofil_user', JSON.stringify(userData)); setScreen('browse'); }} />
        )}
      </div>
    );
  }

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: '100vh', fontFamily: "'Bricolage Grotesque', system-ui" }}>
      <Nav screen={screen} setScreen={setScreen} handleLogout={handleLogout} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div style={{ paddingBottom: '120px' }}>
        {screen === 'browse' && <BrowseScreen cars={cars} onSelect={(id) => { setSelectedCarId(id); setScreen('car-detail'); }} />}
        {screen === 'swap' && <SwapScreen cars={cars} likes={likes} onLike={(id) => setLikes(new Set([...likes, id]))} />}
        {screen === 'upload' && <UploadScreen onSubmit={(car) => { setCars([car, ...cars]); setScreen('browse'); }} user={user} />}
        {screen === 'car-detail' && selectedCar && <CarDetailScreen car={selectedCar} onBack={() => setScreen('browse')} />}
        {screen === 'profile' && <ProfileScreen user={user} cars={cars} />}
      </div>

      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Bricolage+Grotesque:wght@400;500;600;700;800&display=swap');
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

function LoginScreen({ onSwitch, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '32px' }}>
        <div style={{ fontSize: '24px', fontWeight: 800, fontFamily: "'Archivo Black'", marginBottom: '32px', textAlign: 'center' }}>
          TomoFil<span style={{ color: C.accent }}>.</span>
        </div>

        <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" style={{
          width: '100%', padding: '12px', background: C.bgElev, border: `1px solid ${C.border}`, borderRadius: '8px', color: C.text, marginBottom: '12px', fontFamily: 'inherit', outline: 'none',
        }} />

        <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Şifre" style={{
          width: '100%', padding: '12px', background: C.bgElev, border: `1px solid ${C.border}`, borderRadius: '8px', color: C.text, marginBottom: '20px', fontFamily: 'inherit', outline: 'none',
        }} />

        <button onClick={() => onLogin({ name: email.split('@')[0], email, initials: email.substring(0, 2).toUpperCase(), city: 'Lefkoşa' })} style={{
          width: '100%', padding: '12px', background: C.accent, color: C.bg, border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginBottom: '16px',
        }}>Giriş Yap</button>

        <p style={{ fontSize: '13px', color: C.dim, textAlign: 'center' }}>
          Hesabın yok mu? <span style={{ color: C.accent, cursor: 'pointer', fontWeight: 600 }} onClick={onSwitch}>Kayıt Ol</span>
        </p>
      </div>
    </div>
  );
}

function SignupScreen({ onSwitch, onSignup }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '32px' }}>
        <div style={{ fontSize: '24px', fontWeight: 800, fontFamily: "'Archivo Black'", marginBottom: '32px', textAlign: 'center' }}>
          TomoFil<span style={{ color: C.accent }}>.</span>
        </div>

        <input value={name} onChange={e => setName(e.target.value)} placeholder="Ad Soyad" style={{
          width: '100%', padding: '12px', background: C.bgElev, border: `1px solid ${C.border}`, borderRadius: '8px', color: C.text, marginBottom: '12px', fontFamily: 'inherit', outline: 'none',
        }} />

        <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" style={{
          width: '100%', padding: '12px', background: C.bgElev, border: `1px solid ${C.border}`, borderRadius: '8px', color: C.text, marginBottom: '12px', fontFamily: 'inherit', outline: 'none',
        }} />

        <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Şifre" style={{
          width: '100%', padding: '12px', background: C.bgElev, border: `1px solid ${C.border}`, borderRadius: '8px', color: C.text, marginBottom: '20px', fontFamily: 'inherit', outline: 'none',
        }} />

        <button onClick={() => onSignup({ name, email, initials: name.substring(0, 2).toUpperCase(), city: 'Lefkoşa' })} style={{
          width: '100%', padding: '12px', background: C.accent, color: C.bg, border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginBottom: '16px',
        }}>Kayıt Ol</button>

        <p style={{ fontSize: '13px', color: C.dim, textAlign: 'center' }}>
          Zaten hesabın var mı? <span style={{ color: C.accent, cursor: 'pointer', fontWeight: 600 }} onClick={onSwitch}>Giriş Yap</span>
        </p>
      </div>
    </div>
  );
}

function Nav({ screen, setScreen, handleLogout, menuOpen, setMenuOpen }) {
  return (
    <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(10,10,10,0.9)', borderBottom: `1px solid ${C.border}`, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div onClick={() => setScreen('browse')} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
        <div style={{ width: 8, height: 8, background: C.accent, borderRadius: '50%', animation: 'pulse 2s infinite' }} />
        <div style={{ fontFamily: "'Archivo Black'", fontSize: '16px' }}>TomoFil<span style={{ color: C.accent }}>.</span></div>
      </div>

      <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', color: C.text, cursor: 'pointer', fontSize: '20px' }}>
        <Menu size={20} />
      </button>

      {menuOpen && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: C.bgCard, borderTop: `1px solid ${C.border}`, zIndex: 50 }}>
          {[
            { id: 'browse', label: '🔍 Ara' },
            { id: 'swap', label: '⚡ Swap' },
            { id: 'upload', label: '➕ Araç Yükle' },
            { id: 'profile', label: '👤 Profil' },
          ].map(tab => (
            <button key={tab.id} onClick={() => { setScreen(tab.id); setMenuOpen(false); }} style={{
              width: '100%', textAlign: 'left', padding: '12px 16px', background: 'none', border: 'none', color: C.text, cursor: 'pointer', fontFamily: 'inherit', fontSize: '14px', borderBottom: `1px solid ${C.border}`,
            }}>{tab.label}</button>
          ))}
          <button onClick={() => { handleLogout(); setMenuOpen(false); }} style={{
            width: '100%', textAlign: 'left', padding: '12px 16px', background: 'none', border: 'none', color: C.hot, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600,
          }}>Çıkış Yap</button>
        </div>
      )}
    </nav>
  );
}

function BrowseScreen({ cars, onSelect }) {
  return (
    <div style={{ padding: '16px' }}>
      <h1 style={{ fontFamily: "'Archivo Black'", fontSize: '28px', marginBottom: '16px' }}>{cars.length} <span style={{ color: C.accent }}>araç</span></h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
        {cars.map(car => (
          <div key={car.id} onClick={() => onSelect(car.id)} style={{ background: C.bgCard, borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', border: `1px solid ${C.border}` }}>
            <img src={car.photos[0]} alt="" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }} />
            <div style={{ padding: '12px' }}>
              <div style={{ fontWeight: 700, fontSize: '13px' }}>{car.brand}</div>
              <div style={{ fontSize: '11px', color: C.dim, marginBottom: '6px' }}>{car.model}</div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: C.accent }}>€{(car.priceTakassiz / 1000).toFixed(0)}k</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CarDetailScreen({ car, onBack }) {
  const [photoIdx, setPhotoIdx] = useState(0);

  return (
    <div style={{ padding: '16px' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.text, cursor: 'pointer', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: 4, fontSize: '14px' }}>
        <ArrowLeft size={16} /> Geri
      </button>

      <div style={{ aspectRatio: '4/3', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px' }}>
        <img src={car.photos[photoIdx]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
        {car.photos.map((_, i) => (
          <div key={i} onClick={() => setPhotoIdx(i)} style={{ flex: 1, height: '3px', background: i === photoIdx ? C.accent : C.bgElev, borderRadius: '2px', cursor: 'pointer' }} />
        ))}
      </div>

      <h1 style={{ fontFamily: "'Archivo Black'", fontSize: '24px', marginBottom: '4px' }}>{car.brand} {car.model}</h1>
      <p style={{ color: C.dim, fontSize: '12px', marginBottom: '16px' }}>{car.year} • {car.km.toLocaleString()} km</p>

      <div style={{ background: C.bgCard, borderRadius: '12px', padding: '12px', marginBottom: '16px', border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: '11px', color: C.dim, marginBottom: '2px' }}>FİYAT</div>
        <div style={{ fontSize: '22px', fontWeight: 800, color: C.accent }}>€{car.priceTakassiz.toLocaleString()}</div>
      </div>

      {car.hasAccidents && (
        <div style={{ background: 'rgba(255,78,47,0.1)', border: `1px solid ${C.hot}`, borderRadius: '8px', padding: '10px', marginBottom: '12px', fontSize: '12px', color: C.hot }}>
          ⚠️ {car.accidentDesc}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <button style={{ padding: '12px', background: C.accent, color: C.bg, border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px' }}>Mesaj</button>
        <button style={{ padding: '12px', background: C.bgCard, color: C.text, border: `1px solid ${C.border}`, borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: '13px' }}>Teklif</button>
      </div>
    </div>
  );
}

function SwapScreen({ cars, likes, onLike }) {
  const deck = cars.filter(c => !likes.has(c.id));
  const [idx, setIdx] = useState(0);
  const current = deck[idx];

  if (!current) return <div style={{ padding: '40px 16px', textAlign: 'center' }}><Zap size={40} color={C.accent} style={{ margin: '0 auto 12px' }} /><h2>Tüm araçlar bitti</h2></div>;

  return (
    <div style={{ padding: '16px', textAlign: 'center' }}>
      <div style={{ aspectRatio: '3/4', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px', background: C.bgCard }}>
        <img src={current.photos[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <h2 style={{ fontFamily: "'Archivo Black'", fontSize: '22px', marginBottom: '4px' }}>{current.brand} {current.model}</h2>
      <p style={{ color: C.dim, marginBottom: '16px', fontSize: '13px' }}>€{current.priceTakasli.toLocaleString()}</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
        <button onClick={() => setIdx(idx + 1)} style={{ width: '50px', height: '50px', borderRadius: '50%', background: C.bgCard, border: `2px solid ${C.hot}`, color: C.hot, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} /></button>
        <button onClick={() => { onLike(current.id); setIdx(idx + 1); }} style={{ width: '50px', height: '50px', borderRadius: '50%', background: C.accent, border: 'none', color: C.bg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Heart size={20} fill={C.bg} /></button>
      </div>
    </div>
  );
}

function UploadScreen({ onSubmit, user }) {
  const [photos, setPhotos] = useState([]);
  const [form, setForm] = useState({ brand: '', model: '', year: 2020, priceTakassiz: '', km: '', location: 'Lefkoşa' });
  const [analyzing, setAnalyzing] = useState(false);
  const fileRef = useRef();

  const handleAnalyze = async () => {
    if (photos.length === 0) return;
    setAnalyzing(true);
    try {
      const imageContent = photos.slice(0, 2).map(url => ({
        type: 'image',
        source: { type: 'base64', media_type: 'image/jpeg', data: url.split(',')[1] },
      }));
      const res = await fetch('/api/analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ images: imageContent }) });
      const data = await res.json();
      const result = data.content?.[0]?.text ? JSON.parse(data.content[0].text) : {};
      setForm(prev => ({ ...prev, brand: result.brand || '', model: result.model || '', year: result.year || 2020 }));
    } catch (err) { console.error(err); }
    setAnalyzing(false);
  };

  const handleSubmit = () => {
    const car = {
      id: String(Date.now()), ...form, year: +form.year, km: +form.km || 0, priceTakasli: +form.priceTakassiz,
      photos, type: 'Sedan', color: '', condition: 'Good', owners: 1, hasAccidents: false,
      features: [], accidentDesc: '', serviceHistory: '',
      seller: { name: user.name, initials: user.initials, joined: '2025' },
      location: form.location || 'Lefkoşa',
    };
    onSubmit(car);
  };

  return (
    <div style={{ padding: '16px' }}>
      <h1 style={{ fontFamily: "'Archivo Black'", fontSize: '28px', marginBottom: '16px' }}>Araç <span style={{ color: C.accent }}>Yükle</span></h1>

      <div onClick={() => fileRef.current?.click()} style={{ border: `2px dashed ${C.border}`, borderRadius: '12px', padding: '24px 16px', textAlign: 'center', cursor: 'pointer', background: C.bgCard, marginBottom: '16px' }}>
        <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => Array.from(e.target.files || []).forEach(f => { const r = new FileReader(); r.onload = () => setPhotos(p => [...p, r.result]); r.readAsDataURL(f); })} />
        <Upload size={28} color={C.accent} style={{ margin: '0 auto 8px' }} />
        <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>Fotoğrafları yükle</p>
        <p style={{ fontSize: '11px', color: C.dim }}>{photos.length}/5 fotoğraf</p>
      </div>

      {photos.length > 0 && <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', overflowX: 'auto' }}>{photos.map((p, i) => <img key={i} src={p} alt="" style={{ width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }} />)}</div>}

      <button onClick={handleAnalyze} style={{ width: '100%', padding: '12px', background: C.accent, color: C.bg, border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: '13px' }}>
        {analyzing ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Analiz</> : <><Sparkles size={14} /> AI Analiz</>}
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
        <input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} placeholder="Marka" style={{ padding: '10px', background: C.bgElev, border: `1px solid ${C.border}`, borderRadius: '6px', color: C.text, fontFamily: 'inherit', outline: 'none', fontSize: '12px' }} />
        <input value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} placeholder="Model" style={{ padding: '10px', background: C.bgElev, border: `1px solid ${C.border}`, borderRadius: '6px', color: C.text, fontFamily: 'inherit', outline: 'none', fontSize: '12px' }} />
        <input type="number" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} placeholder="Yıl" style={{ padding: '10px', background: C.bgElev, border: `1px solid ${C.border}`, borderRadius: '6px', color: C.text, fontFamily: 'inherit', outline: 'none', fontSize: '12px' }} />
        <input type="number" value={form.km} onChange={e => setForm({ ...form, km: e.target.value })} placeholder="KM" style={{ padding: '10px', background: C.bgElev, border: `1px solid ${C.border}`, borderRadius: '6px', color: C.text, fontFamily: 'inherit', outline: 'none', fontSize: '12px' }} />
      </div>

      <input type="number" value={form.priceTakassiz} onChange={e => setForm({ ...form, priceTakassiz: e.target.value })} placeholder="Fiyat (€)" style={{ width: '100%', padding: '10px', background: C.bgElev, border: `1px solid ${C.border}`, borderRadius: '6px', color: C.text, fontFamily: 'inherit', outline: 'none', fontSize: '12px', marginBottom: '12px' }} />

      <button onClick={handleSubmit} style={{ width: '100%', padding: '12px', background: C.accent, color: C.bg, border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: '13px' }}><Check size={14} /> Yayınla</button>
    </div>
  );
}

function ProfileScreen({ user, cars }) {
  return (
    <div style={{ padding: '16px' }}>
      <div style={{ background: C.bgCard, padding: '16px', borderRadius: '12px', marginBottom: '20px', textAlign: 'center', border: `1px solid ${C.border}` }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: `linear-gradient(135deg, ${C.warm}, ${C.hot})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '16px', color: C.bg, margin: '0 auto 12px' }}>{user.initials}</div>
        <div style={{ fontWeight: 700, fontSize: '15px' }}>{user.name}</div>
      </div>
      <h2 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>İlanlarım ({cars.length})</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px' }}>
        {cars.map(c => <div key={c.id} style={{ borderRadius: '8px', overflow: 'hidden', background: C.bgCard, border: `1px solid ${C.border}` }}><img src={c.photos[0]} alt="" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }} /><div style={{ padding: '6px', fontSize: '11px' }}>{c.brand}</div></div>)}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(10,10,10,0.95)', borderTop: `1px solid ${C.border}`, padding: '12px', textAlign: 'center', fontSize: '11px', color: C.dim }}>
      <div>© 2025 TomoFil. KKTC'nin AI araç takas platformu.</div>
    </footer>
  );
}
