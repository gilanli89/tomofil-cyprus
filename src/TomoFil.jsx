import React, { useState, useRef } from 'react';
import { Search, Zap, Heart, Upload, Sparkles, Loader2, X, Plus, Check } from 'lucide-react';

// Design System
const theme = {
  bg: '#000000',
  card: '#0a0a0a',
  cardHover: '#111111',
  border: 'rgba(255,255,255,0.06)',
  text: '#ffffff',
  dim: '#888888',
  accent: '#d4ff4a',
  accentDark: '#b8d93f',
};

// Real Car Data - PHOTOS MATCH THE CARS!
const SEED_CARS = [
  {
    id: '1', brand: 'Audi', model: 'RS6 Avant', year: 2020, type: 'Sedan',
    color: 'Siyah', condition: 'Mükemmel', km: 45000, owners: 1, price: 52000,
    location: 'Girne', features: ['Quattro AWD', 'LED Far', 'Panoramik Tavan', 'Deri Koltuk'],
    photos: ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80'],
  },
  {
    id: '2', brand: 'Honda', model: 'CR-V', year: 2021, type: 'SUV',
    color: 'Beyaz', condition: 'Mükemmel', km: 25000, owners: 1, price: 28000,
    location: 'Lefkoşa', features: ['AWD', 'Park Sensörü', 'Klima'],
    photos: ['https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80'],
  },
  {
    id: '3', brand: 'Ford', model: 'Expedition', year: 2020, type: 'SUV',
    color: 'Beyaz', condition: 'Mükemmel', km: 38000, owners: 1, price: 42000,
    location: 'Mağusa', features: ['4WD', '3rd Row Seats', 'Premium Ses Sistemi'],
    photos: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80'],
  },
  {
    id: '4', brand: 'Chevrolet', model: 'Camaro SS', year: 2020, type: 'Coupe',
    color: 'Mavi', condition: 'Mükemmel', km: 12000, owners: 1, price: 48000,
    location: 'Lefkoşa', features: ['V8 Motor', 'LED Far', 'Spor Egzoz'],
    photos: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80'],
  },
  {
    id: '5', brand: 'BMW', model: 'M5', year: 2021, type: 'Sedan',
    color: 'Beyaz', condition: 'Mükemmel', km: 22000, owners: 1, price: 68000,
    location: 'Girne', features: ['M Sport', 'Harman Kardon', 'Heads-Up Display', 'Deri Koltuk'],
    photos: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80'],
  },
  {
    id: '6', brand: 'Porsche', model: 'Cayenne Turbo', year: 2020, type: 'SUV',
    color: 'Siyah', condition: 'Mükemmel', km: 35000, owners: 1, price: 75000,
    location: 'Güzelyurt', features: ['Air Suspension', 'Panoramik Tavan', 'Bose Sound', 'Sport Chrono'],
    photos: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80'],
  },
];

const BRANDS = ['Audi', 'BMW', 'Mercedes', 'Toyota', 'Honda', 'Ford', 'Volkswagen', 'Hyundai', 'Nissan', 'Range Rover', 'Porsche', 'Lamborghini'];
const TYPES = ['Sedan', 'SUV', 'Pickup', 'Hatchback', 'Coupe', 'Cabrio', 'Van', 'Wagon', 'Crossover'];
const LOCATIONS = ['Lefkoşa', 'Girne', 'Mağusa', 'Güzelyurt', 'İskele', 'Lefke'];
const CONDITIONS = ['Mükemmel', 'Çok İyi', 'İyi', 'Orta'];
const FEATURES = [
  'Sunroof', 'Panoramik Tavan', 'Deri Koltuk', 'İsıtmalı Koltuk', 'Masaj Koltuğu', 'Elektrikli Koltuk',
  'LED Far', 'Adaptif Far', 'Park Sensörü', 'Geri Vites Kamerası', '360 Kamera', 'Navigasyon',
  'Android Auto / CarPlay', 'Keyless Entry', 'Cruise Control', 'Adaptif Cruise', 'HUD',
  'Ambient Aydınlatma', 'Klima', 'İkili Klima', '4x4', 'Çekme Demir',
  'Yükseltilmiş Süspansiyon', 'Spor Egzoz', 'Sport Paket', 'Premium Ses Sistemi', 'Harman Kardon'
];

export default function TomoFil() {
  const [screen, setScreen] = useState('browse');
  const [user, setUser] = useState({ name: 'Demo User', initials: 'DK' });
  const [cars, setCars] = useState(SEED_CARS);
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ brand: '', type: '', location: '' });

  const selectedCar = cars.find(c => c.id === selectedCarId);

  const filteredCars = cars.filter(car => {
    const matchesSearch = searchQuery === '' || 
      car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = filters.brand === '' || car.brand === filters.brand;
    const matchesType = filters.type === '' || car.type === filters.type;
    const matchesLocation = filters.location === '' || car.location === filters.location;
    return matchesSearch && matchesBrand && matchesType && matchesLocation;
  });

  return (
    <div style={{ background: theme.bg, color: theme.text, minHeight: '100vh', fontFamily: "'Inter', system-ui" }}>
      <Nav screen={screen} setScreen={setScreen} user={user} />

      <div style={{ paddingBottom: '80px' }}>
        {screen === 'browse' && (
          <BrowseScreen 
            cars={filteredCars}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filters={filters}
            setFilters={setFilters}
            onSelect={(id) => { setSelectedCarId(id); setScreen('detail'); }}
          />
        )}
        {screen === 'upload' && (
          <UploadScreen 
            onSubmit={(car) => { setCars([car, ...cars]); setScreen('browse'); }}
            user={user}
          />
        )}
        {screen === 'detail' && selectedCar && (
          <CarDetailScreen car={selectedCar} onBack={() => setScreen('browse')} />
        )}
        {screen === 'swap' && <SwapScreen />}
        {screen === 'matches' && <MatchesScreen />}
      </div>

      <Footer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { overflow-x: hidden; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
}

function Nav({ screen, setScreen, user }) {
  return (
    <nav style={{ 
      background: theme.bg, 
      borderBottom: `1px solid ${theme.border}`,
      padding: '16px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div 
        onClick={() => setScreen('browse')} 
        style={{ fontSize: '24px', fontWeight: 900, cursor: 'pointer', color: theme.accent }}
      >
        Tomofil
      </div>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        <NavLink icon={<Search size={16} />} label="Ara" active={screen === 'browse'} onClick={() => setScreen('browse')} />
        <NavLink icon={<Zap size={16} />} label="Swap" active={screen === 'swap'} onClick={() => setScreen('swap')} />
        <NavLink icon={<Heart size={16} />} label="Eşleşme" active={screen === 'matches'} onClick={() => setScreen('matches')} />
        
        <button 
          onClick={() => setScreen('upload')}
          style={{
            background: theme.accent,
            color: theme.bg,
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Plus size={16} /> Araç Yükle
        </button>

        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentDark})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: '14px',
          color: theme.bg,
          cursor: 'pointer',
        }}>
          {user.initials}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        color: active ? theme.text : theme.dim,
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'color 0.2s',
      }}
    >
      {icon} {label}
    </button>
  );
}

function BrowseScreen({ cars, searchQuery, setSearchQuery, filters, setFilters, onSelect }) {
  return (
    <div style={{ padding: '40px 24px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '32px' }}>
          {cars.length} <span style={{ color: theme.accent }}>araç</span>
        </h1>

        {/* Search & Filters */}
        <div style={{ marginBottom: '32px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Marka veya model ara..."
            style={{
              flex: 1,
              minWidth: '300px',
              padding: '14px 18px',
              background: theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: '12px',
              color: theme.text,
              fontSize: '15px',
              outline: 'none',
            }}
          />
          
          <select
            value={filters.brand}
            onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
            style={{
              padding: '14px 18px',
              background: theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: '12px',
              color: filters.brand ? theme.text : theme.dim,
              fontSize: '15px',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="">Tüm Markalar</option>
            {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>

          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            style={{
              padding: '14px 18px',
              background: theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: '12px',
              color: filters.type ? theme.text : theme.dim,
              fontSize: '15px',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="">Tüm Tipler</option>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <select
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            style={{
              padding: '14px 18px',
              background: theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: '12px',
              color: filters.location ? theme.text : theme.dim,
              fontSize: '15px',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="">Tüm Şehirler</option>
            {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        {/* Car Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '24px',
        }}>
          {cars.map(car => (
            <CarCard key={car.id} car={car} onClick={() => onSelect(car.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CarCard({ car, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: theme.card,
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        border: `1px solid ${theme.border}`,
        transition: 'all 0.3s',
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ 
        aspectRatio: '16/10', 
        background: theme.cardHover,
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: theme.accent,
          color: theme.bg,
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
        }}>
          {car.type}
        </div>
        {car.photos[0] && (
          <img 
            src={car.photos[0]} 
            alt={car.brand}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </div>

      <div style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>
          {car.brand} {car.model}
        </h3>
        <p style={{ fontSize: '13px', color: theme.dim, marginBottom: '16px' }}>
          {car.year} • {car.km.toLocaleString()} km • {car.owners}. sahip
        </p>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          paddingTop: '16px',
          borderTop: `1px solid ${theme.border}`,
        }}>
          <div>
            <div style={{ fontSize: '12px', color: theme.dim, marginBottom: '2px' }}>TAKASSIZ</div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: theme.accent }}>
              £{car.price.toLocaleString()}
            </div>
          </div>
          <div style={{ fontSize: '13px', color: theme.dim }}>
            📍 {car.location}
          </div>
        </div>
      </div>
    </div>
  );
}

function UploadScreen({ onSubmit, user }) {
  const [step, setStep] = useState(1); // 1: photo, 2: AI or manual, 3: form
  const [photos, setPhotos] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [form, setForm] = useState({
    brand: '', model: '', year: new Date().getFullYear(), type: '', color: '',
    condition: 'Mükemmel', km: '', owners: 1, price: '', location: 'Lefkoşa',
    features: [],
  });
  const fileRef = useRef();

  const handlePhotoUpload = (files) => {
    Array.from(files).forEach(f => {
      const reader = new FileReader();
      reader.onload = () => setPhotos(prev => [...prev, reader.result]);
      reader.readAsDataURL(f);
    });
  };

  const handleAIAnalyze = async () => {
    if (photos.length === 0) return;
    setAnalyzing(true);
    
    try {
      const imageContent = photos.slice(0, 2).map(url => ({
        type: 'image',
        source: { type: 'base64', media_type: 'image/jpeg', data: url.split(',')[1] },
      }));

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: imageContent }),
      });

      const data = await res.json();
      const result = data.content?.[0]?.text ? JSON.parse(data.content[0].text) : {};
      
      setAiData(result);
      setForm(prev => ({
        ...prev,
        brand: result.brand || '',
        model: result.model || '',
        year: result.year || new Date().getFullYear(),
        type: result.type || '',
        color: result.color || '',
        condition: result.condition || 'Mükemmel',
        features: result.features || [],
      }));
      setStep(3);
    } catch (err) {
      console.error('AI analiz hatası:', err);
      setStep(3); // Hata olsa bile form'a geç
    }
    
    setAnalyzing(false);
  };

  const handleSubmit = () => {
    const newCar = {
      id: String(Date.now()),
      ...form,
      year: +form.year,
      km: +form.km || 0,
      owners: +form.owners || 1,
      price: +form.price || 0,
      photos,
    };
    onSubmit(newCar);
  };

  const toggleFeature = (feature) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  if (step === 1) {
    // Step 1: Photo Upload
    return (
      <div style={{ padding: '40px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontSize: '12px', color: theme.dim, marginBottom: '12px', letterSpacing: '2px' }}>
              ADIM 1 / 2 - FOTOĞRAF
            </div>
            <h1 style={{ fontSize: '48px', fontWeight: 900, marginBottom: '12px' }}>
              Fotoğraf yükle, <span style={{ color: theme.accent }}>AI tanısın</span>
            </h1>
            <div style={{
              width: '300px',
              height: '4px',
              background: `linear-gradient(90deg, ${theme.accent} 0%, ${theme.accent} 50%, ${theme.border} 50%)`,
              margin: '0 auto',
            }} />
          </div>

          <div
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${theme.border}`,
              borderRadius: '24px',
              padding: '80px 40px',
              textAlign: 'center',
              cursor: 'pointer',
              background: theme.card,
              marginBottom: '24px',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = theme.accent}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = theme.border}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => handlePhotoUpload(e.target.files)}
            />
            <Upload size={48} color={theme.accent} style={{ margin: '0 auto 20px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>
              Fotoğrafları sürükle veya tıkla
            </h3>
            <p style={{ color: theme.dim, fontSize: '14px' }}>
              JPG, PNG, WebP • Maks 20MB • En fazla 10 adet
            </p>
          </div>

          {photos.length > 0 && (
            <>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '12px',
                marginBottom: '32px',
              }}>
                {photos.map((photo, i) => (
                  <div key={i} style={{ position: 'relative', aspectRatio: '4/3', borderRadius: '12px', overflow: 'hidden' }}>
                    <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPhotos(prev => prev.filter((_, idx) => idx !== i));
                      }}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'rgba(0,0,0,0.8)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: theme.text,
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <p style={{ textAlign: 'center', fontSize: '13px', color: theme.dim, marginBottom: '24px' }}>
                {photos.length} fotoğraf seçildi - Kapak için birine tıkla
              </p>

              <button
                onClick={() => setStep(2)}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: theme.accent,
                  color: theme.bg,
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                Devam Et →
              </button>
            </>
          )}

          <Stats />
        </div>
      </div>
    );
  }

  if (step === 2) {
    // Step 2: AI or Manual
    return (
      <div style={{ padding: '40px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontSize: '12px', color: theme.dim, marginBottom: '12px', letterSpacing: '2px' }}>
              ADIM 2 / 2 - FOTOĞRAF
            </div>
            <h1 style={{ fontSize: '48px', fontWeight: 900, marginBottom: '12px' }}>
              Fotoğraf yükle, <span style={{ color: theme.accent }}>AI tanısın</span>
            </h1>
            <div style={{
              width: '300px',
              height: '4px',
              background: theme.accent,
              margin: '0 auto',
            }} />
          </div>

          <div style={{
            background: theme.card,
            border: `1px solid ${theme.border}`,
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img 
                src={photos[0]} 
                alt="" 
                style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
                  {photos[0]?.name || 'Araç fotoğrafı'}
                </div>
                <div style={{ fontSize: '12px', color: theme.dim }}>Kapak fotoğraf</div>
              </div>
              <Check size={20} color={theme.accent} />
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: '13px', color: theme.dim, marginBottom: '24px' }}>
            {photos.length} fotoğraf seçildi - Kapak için birine tıkla
          </p>

          <button
            onClick={handleAIAnalyze}
            disabled={analyzing}
            style={{
              width: '100%',
              padding: '20px',
              background: theme.accent,
              color: theme.bg,
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: 700,
              cursor: analyzing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginBottom: '16px',
            }}
          >
            {analyzing ? (
              <>
                <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                Analiz ediliyor...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Araç Tanı ({photos.length} fotoğraf)
              </>
            )}
          </button>

          <button
            onClick={() => setStep(3)}
            style={{
              width: '100%',
              padding: '16px',
              background: 'transparent',
              color: theme.dim,
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Manuel doldur →
          </button>

          <Stats />
        </div>
      </div>
    );
  }

  // Step 3: Form
  return (
    <div style={{ padding: '40px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 900, marginBottom: '12px' }}>
          Bilgileri kontrol et, <span style={{ color: theme.accent }}>yayınla</span>
        </h1>
        <div style={{
          width: '400px',
          height: '4px',
          background: theme.accent,
          marginBottom: '48px',
        }} />

        {/* Photos */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {photos.map((photo, i) => (
            <img 
              key={i}
              src={photo} 
              alt="" 
              style={{ 
                width: '100px', 
                height: '100px', 
                borderRadius: '12px', 
                objectFit: 'cover',
                border: i === 0 ? `3px solid ${theme.accent}` : 'none',
              }}
            />
          ))}
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '12px',
              border: `2px dashed ${theme.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              background: theme.card,
            }}
          >
            <Plus size={24} color={theme.dim} />
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => handlePhotoUpload(e.target.files)}
          />
        </div>

        {/* Form */}
        <div style={{ background: theme.card, borderRadius: '16px', border: `1px solid ${theme.border}`, padding: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>Araç Bilgileri</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <FormField label="MARKA" required>
              <select
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                style={inputStyle}
              >
                <option value="">Seçiniz...</option>
                {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </FormField>

            <FormField label="MODEL" required>
              <input
                type="text"
                value={form.model}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                placeholder={form.brand ? "Model giriniz" : "Önce marka seç"}
                disabled={!form.brand}
                style={inputStyle}
              />
            </FormField>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <FormField label="YIL" required>
              <select
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                style={inputStyle}
              >
                {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </FormField>

            <FormField label="ARAÇ TİPİ" required>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                style={inputStyle}
              >
                <option value="">Seçiniz...</option>
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </FormField>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <FormField label="RENK">
              <input
                type="text"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                placeholder="Beyaz, Siyah, Gümüş..."
                style={inputStyle}
              />
            </FormField>

            <FormField label="DURUM">
              <select
                value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value })}
                style={inputStyle}
              >
                {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <FormField label="KİLOMETRE" required>
              <input
                type="number"
                value={form.km}
                onChange={(e) => setForm({ ...form, km: e.target.value })}
                placeholder="örn. 75000"
                style={inputStyle}
              />
            </FormField>

            <FormField label="FİYAT (£)" required>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="örn. 25000"
                style={inputStyle}
              />
            </FormField>
          </div>

          <FormField label="SAHİPLİK" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[1, 2, 3].map(n => (
                <button
                  key={n}
                  onClick={() => setForm({ ...form, owners: n })}
                  style={{
                    padding: '10px 20px',
                    background: form.owners === n ? theme.accent : theme.bg,
                    color: form.owners === n ? theme.bg : theme.text,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {n}. sahip
                </button>
              ))}
            </div>
          </FormField>

          <FormField label="ÖZELLİKLER">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              {FEATURES.map(feature => (
                <button
                  key={feature}
                  onClick={() => toggleFeature(feature)}
                  style={{
                    padding: '8px 16px',
                    background: form.features.includes(feature) ? theme.accent : theme.bg,
                    color: form.features.includes(feature) ? theme.bg : theme.text,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  {feature}
                </button>
              ))}
            </div>
          </FormField>

          <button
            onClick={handleSubmit}
            style={{
              width: '100%',
              padding: '16px',
              background: theme.accent,
              color: theme.bg,
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
              marginTop: '24px',
            }}
          >
            <Check size={18} style={{ marginRight: '8px', display: 'inline' }} />
            Yayınla
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, required, children, style }) {
  return (
    <div style={style}>
      <label style={{ 
        display: 'block', 
        fontSize: '11px', 
        fontWeight: 700, 
        color: theme.dim,
        marginBottom: '8px',
        letterSpacing: '1px',
      }}>
        {label} {required && <span style={{ color: theme.accent }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  background: theme.bg,
  border: `1px solid ${theme.border}`,
  borderRadius: '8px',
  color: theme.text,
  fontSize: '14px',
  outline: 'none',
  fontFamily: 'inherit',
};

function CarDetailScreen({ car, onBack }) {
  return (
    <div style={{ padding: '40px 24px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: theme.text,
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: '24px',
          }}
        >
          ← Geri
        </button>

        <div style={{ 
          aspectRatio: '16/9',
          borderRadius: '24px',
          overflow: 'hidden',
          marginBottom: '32px',
          background: theme.card,
        }}>
          {car.photos[0] && (
            <img src={car.photos[0]} alt={car.brand} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          <div>
            <div style={{
              display: 'inline-block',
              background: theme.accent,
              color: theme.bg,
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              marginBottom: '16px',
            }}>
              {car.type}
            </div>

            <h1 style={{ fontSize: '48px', fontWeight: 900, marginBottom: '8px' }}>
              {car.brand} {car.model}
            </h1>
            <p style={{ fontSize: '16px', color: theme.dim, marginBottom: '32px' }}>
              {car.year} • {car.km.toLocaleString()} km • {car.owners}. sahip
            </p>

            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Özellikler</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {car.features.map(f => (
                <span
                  key={f}
                  style={{
                    padding: '8px 16px',
                    background: theme.card,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '8px',
                    fontSize: '13px',
                  }}
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div style={{
              background: theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '16px',
            }}>
              <div style={{ fontSize: '12px', color: theme.dim, marginBottom: '8px' }}>TAKASSIZ FİYAT</div>
              <div style={{ fontSize: '36px', fontWeight: 900, color: theme.accent, marginBottom: '16px' }}>
                £{car.price.toLocaleString()}
              </div>
              <div style={{ fontSize: '13px', color: theme.dim, marginBottom: '4px' }}>📍 {car.location}</div>
              <div style={{ fontSize: '13px', color: theme.dim }}>🟢 {car.condition}</div>
            </div>

            <button
              style={{
                width: '100%',
                padding: '16px',
                background: theme.accent,
                color: theme.bg,
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                marginBottom: '12px',
              }}
            >
              Mesaj Gönder
            </button>

            <button
              style={{
                width: '100%',
                padding: '16px',
                background: 'transparent',
                color: theme.text,
                border: `1px solid ${theme.border}`,
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Heart size={18} style={{ marginRight: '8px', display: 'inline' }} />
              Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SwapScreen() {
  return (
    <div style={{ padding: '80px 24px', textAlign: 'center' }}>
      <Zap size={64} color={theme.accent} style={{ margin: '0 auto 24px' }} />
      <h1 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '16px' }}>
        Swap Özelliği <span style={{ color: theme.accent }}>Yakında</span>
      </h1>
      <p style={{ color: theme.dim, fontSize: '16px' }}>Tinder-style araç eşleştirme sistemi geliştiriliyor...</p>
    </div>
  );
}

function MatchesScreen() {
  return (
    <div style={{ padding: '80px 24px', textAlign: 'center' }}>
      <Heart size={64} color={theme.accent} style={{ margin: '0 auto 24px' }} />
      <h1 style={{ fontSize: '36px', fontWeight: 900, marginBottom: '16px' }}>
        Eşleşmeler <span style={{ color: theme.accent }}>Yakında</span>
      </h1>
      <p style={{ color: theme.dim, fontSize: '16px' }}>Favori araçlarınız ve takas teklifleriniz burada görünecek...</p>
    </div>
  );
}

function Stats() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '24px',
      marginTop: '64px',
      paddingTop: '48px',
      borderTop: `1px solid ${theme.border}`,
    }}>
      {[
        { value: '500+', label: 'Aktif İlan' },
        { value: '1.2k+', label: 'Kayıtlı Kullanıcı' },
        { value: '%98', label: 'Memnuniyet' },
        { value: '6 Şehir', label: 'KKTC Geneli' },
      ].map(stat => (
        <div key={stat.label} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: 900, color: theme.accent, marginBottom: '8px' }}>
            {stat.value}
          </div>
          <div style={{ fontSize: '13px', color: theme.dim }}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

function Footer() {
  return (
    <footer style={{
      background: theme.bg,
      borderTop: `1px solid ${theme.border}`,
      padding: '48px 24px',
      marginTop: '80px',
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '48px' }}>
        <div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: theme.accent, marginBottom: '16px' }}>Tomofil</div>
          <p style={{ fontSize: '14px', color: theme.dim, lineHeight: 1.6, marginBottom: '16px' }}>
            KKTC'nin ilk AI destekli araç alım-satım ve takas platformu. Fotoğrafını yükle, AI tanısın, hemen ilan ver.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <a href="#" style={{ width: '40px', height: '40px', borderRadius: '50%', background: theme.card, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.text, textDecoration: 'none' }}>📷</a>
            <a href="#" style={{ width: '40px', height: '40px', borderRadius: '50%', background: theme.card, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.text, textDecoration: 'none' }}>📱</a>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: theme.dim, marginBottom: '16px', letterSpacing: '1px' }}>SAYFALAR</div>
          {['Araç Ara', 'Swap', 'Eşleşmeler', 'Araç Yükle', 'Profilim'].map(link => (
            <div key={link} style={{ marginBottom: '12px' }}>
              <a href="#" style={{ color: theme.text, textDecoration: 'none', fontSize: '14px' }}>{link}</a>
            </div>
          ))}
        </div>

        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: theme.dim, marginBottom: '16px', letterSpacing: '1px' }}>HİZMET BÖLGELERİ</div>
          {LOCATIONS.map(loc => (
            <div key={loc} style={{ marginBottom: '12px' }}>
              <a href="#" style={{ color: theme.text, textDecoration: 'none', fontSize: '14px' }}>📍 {loc}</a>
            </div>
          ))}
        </div>

        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: theme.dim, marginBottom: '16px', letterSpacing: '1px' }}>KATEGORİLER</div>
          {TYPES.slice(0, 6).map(type => (
            <div key={type} style={{ marginBottom: '12px' }}>
              <a href="#" style={{ color: theme.text, textDecoration: 'none', fontSize: '14px' }}>{type}</a>
            </div>
          ))}
        </div>

        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: theme.dim, marginBottom: '16px', letterSpacing: '1px' }}>İLETİŞİM</div>
          <div style={{ marginBottom: '12px', fontSize: '14px', color: theme.text }}>info@tomofil.com</div>
          <div style={{ fontSize: '14px', color: theme.text }}>+90 542 000 00 00</div>
        </div>
      </div>

      <div style={{ 
        maxWidth: '1400px', 
        margin: '48px auto 0', 
        paddingTop: '24px', 
        borderTop: `1px solid ${theme.border}`,
        textAlign: 'center',
        fontSize: '13px',
        color: theme.dim,
      }}>
        © 2025 Tomofil. KKTC'nin AI araç takas platformu.
      </div>
    </footer>
  );
}
