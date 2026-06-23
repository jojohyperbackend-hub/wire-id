import { useEffect, useRef, useState, useCallback } from 'react';
import Ticker from './components/Ticker';
import NewsCard from './components/NewsCard';

// ─── Design tokens (from DESIGN.md) ───────────────────────────────────────
// Applied inline as Tailwind arbitrary values where CSS vars aren't yet wired.
// In production, put these in your tailwind.config.js / CSS @theme block.

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const REFRESH_SECONDS = 60;

const CATEGORIES = [
  { id: 'general',       label: 'Semua',     query: 'Indonesia',                                                                  keywords: null },
  { id: 'business',      label: 'Bisnis',    query: 'Indonesia AND (ekonomi OR bisnis OR investasi OR "harga saham" OR rupiah)',    keywords: ['ekonomi', 'bisnis', 'investasi', 'saham', 'rupiah', 'pasar', 'perdagangan'] },
  { id: 'technology',    label: 'Teknologi', query: 'Indonesia AND (teknologi OR startup OR aplikasi OR digital OR "kecerdasan buatan")', keywords: ['teknologi', 'startup', 'aplikasi', 'digital', 'ai', 'kecerdasan buatan', 'software', 'gadget'] },
  { id: 'sports',        label: 'Olahraga',  query: 'Indonesia AND (olahraga OR "sepak bola" OR timnas OR liga OR atlet)',           keywords: ['olahraga', 'sepak bola', 'timnas', 'liga', 'atlet', 'pertandingan', 'turnamen', 'bola'] },
  { id: 'entertainment', label: 'Hiburan',   query: 'Indonesia AND (hiburan OR selebriti OR artis OR film OR musik)',                keywords: ['hiburan', 'selebriti', 'artis', 'film', 'musik', 'konser', 'aktor', 'aktris'] },
  { id: 'health',        label: 'Kesehatan', query: 'Indonesia AND (kesehatan OR penyakit OR rumah sakit OR dokter OR vaksin)',       keywords: ['kesehatan', 'penyakit', 'rumah sakit', 'dokter', 'vaksin', 'medis', 'obat'] },
  { id: 'science',       label: 'Sains',     query: 'Indonesia AND (sains OR penelitian OR riset OR ilmuwan OR "luar angkasa")',      keywords: ['sains', 'penelitian', 'riset', 'ilmuwan', 'luar angkasa', 'antariksa', 'sains'] },
];

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

// ─── Sub-components ────────────────────────────────────────────────────────

/** Live status bar — surface-black, 44 px tall, nav-link typography */
function StatusBar({ secondsToRefresh, clock }) {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5"
      style={{
        backgroundColor: '#000000',
        height: '44px',
        fontFamily: 'SF Pro Text, system-ui, -apple-system, sans-serif',
        fontSize: '12px',
        fontWeight: 400,
        letterSpacing: '-0.12px',
        color: '#ffffff',
      }}
    >
      <span className="flex items-center gap-2">
        {/* Live dot */}
        <span
          className="inline-block rounded-full animate-pulse"
          style={{ width: 6, height: 6, backgroundColor: '#2997ff' }}
        />
        <span style={{ color: '#cccccc' }}>
          LIVE &middot; refresh dalam {secondsToRefresh}s
        </span>
      </span>
      <span style={{ color: '#cccccc' }}>
        {clock.toLocaleTimeString('id-ID')}
      </span>
    </div>
  );
}

/** Product-style hero tile — parchment canvas, full-bleed */
function HeroSection({ article }) {
  if (!article) return null;
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: '#f5f5f7',
        paddingTop: '80px',
        paddingBottom: '80px',
      }}
    >
      <div className="mx-auto px-5" style={{ maxWidth: '980px' }}>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block"
        >
          {/* Product image */}
          <div
            className="w-full overflow-hidden mb-8"
            style={{ borderRadius: '0px' }}
          >
            <img
              src={article.urlToImage || 'https://placehold.co/980x520/f5f5f7/1d1d1f?text=WIRE.ID'}
              alt=""
              className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              style={{
                maxHeight: '520px',
                boxShadow: 'rgba(0,0,0,0.22) 3px 5px 30px 0',
              }}
              onError={(e) => {
                e.target.src = 'https://placehold.co/980x520/f5f5f7/1d1d1f?text=WIRE.ID';
              }}
            />
          </div>

          {/* Headline block */}
          <div className="text-center">
            {article.source?.name && (
              <p
                className="mb-3"
                style={{
                  fontFamily: 'SF Pro Text, system-ui, -apple-system, sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  letterSpacing: '-0.224px',
                  color: '#0066cc',
                  lineHeight: 1.29,
                }}
              >
                {article.source.name}
              </p>
            )}
            <h2
              className="mx-auto mb-4"
              style={{
                fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif',
                fontSize: 'clamp(28px, 4vw, 40px)',
                fontWeight: 600,
                lineHeight: 1.10,
                letterSpacing: '0px',
                color: '#1d1d1f',
                maxWidth: '720px',
              }}
            >
              {article.title}
            </h2>
            {article.description && (
              <p
                className="mx-auto mb-6"
                style={{
                  fontFamily: 'SF Pro Text, system-ui, -apple-system, sans-serif',
                  fontSize: '17px',
                  fontWeight: 400,
                  lineHeight: 1.47,
                  letterSpacing: '-0.374px',
                  color: '#1d1d1f',
                  maxWidth: '600px',
                }}
              >
                {article.description}
              </p>
            )}
            {/* Primary CTA — pill, Action Blue */}
            <span
              className="inline-block transition-transform active:scale-95"
              style={{
                backgroundColor: '#0066cc',
                color: '#ffffff',
                borderRadius: '9999px',
                padding: '11px 22px',
                fontFamily: 'SF Pro Text, system-ui, -apple-system, sans-serif',
                fontSize: '17px',
                fontWeight: 400,
                lineHeight: 1.47,
                letterSpacing: '-0.374px',
              }}
            >
              Baca selengkapnya
            </span>
          </div>
        </a>
      </div>
    </section>
  );
}

/** Side list item — numbered, dark tile */
function SideItem({ article, index }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-4 group py-4 transition-opacity hover:opacity-80"
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <span
        style={{
          fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif',
          fontSize: '21px',
          fontWeight: 600,
          letterSpacing: '0.231px',
          color: '#2997ff',
          lineHeight: 1.19,
          minWidth: '36px',
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="flex-1">
        {article.source?.name && (
          <p
            className="mb-1"
            style={{
              fontFamily: 'SF Pro Text, system-ui, -apple-system, sans-serif',
              fontSize: '12px',
              fontWeight: 400,
              letterSpacing: '-0.12px',
              color: '#cccccc',
              lineHeight: 1.0,
            }}
          >
            {article.source.name}
          </p>
        )}
        <h3
          style={{
            fontFamily: 'SF Pro Text, system-ui, -apple-system, sans-serif',
            fontSize: '17px',
            fontWeight: 400,
            lineHeight: 1.47,
            letterSpacing: '-0.374px',
            color: '#ffffff',
          }}
        >
          {article.title}
        </h3>
      </div>
    </a>
  );
}

/** Skeleton shimmer card */
function SkeletonCard() {
  return (
    <div
      className="animate-pulse"
      style={{
        backgroundColor: '#f5f5f7',
        borderRadius: '18px',
        height: '280px',
      }}
    />
  );
}

/** Notice / state message */
function Notice({ children }) {
  return (
    <div
      className="mx-auto my-8 px-5"
      style={{ maxWidth: '980px' }}
    >
      <p
        style={{
          fontFamily: 'SF Pro Text, system-ui, -apple-system, sans-serif',
          fontSize: '17px',
          fontWeight: 400,
          lineHeight: 1.47,
          letterSpacing: '-0.374px',
          color: '#7a7a7a',
          textAlign: 'center',
          padding: '48px 0',
        }}
      >
        {children}
      </p>
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────

export default function App() {
  const [category, setCategory]             = useState('general');
  const [articles, setArticles]             = useState([]);
  const [status, setStatus]                 = useState('loading');
  const [secondsToRefresh, setSecondsToRefresh] = useState(REFRESH_SECONDS);
  const [errorMsg, setErrorMsg] = useState('');
  const clock                               = useClock();
  const countdownRef                        = useRef(null);

  const fetchNews = useCallback(async (cat) => {
    setStatus('loading');
    if (!API_KEY) { setArticles([]); setStatus('no-key'); return; }
    try {
      // top-headlines + country=id seringkali totalResults=0 di free plan
      // (sumber media Indonesia yang mereka index untuk endpoint itu sangat
      // sedikit). /v2/everything punya jauh lebih banyak sumber, jadi kita
      // cari pakai keyword + language=id, diurutkan dari yang paling baru
      // (otomatis = tahun berjalan / 2026, tanpa perlu filter manual).
      const cfg = CATEGORIES.find((c) => c.id === cat);
      const q   = encodeURIComponent(cfg?.query || 'Indonesia');
      const url = `https://newsapi.org/v2/everything?q=${q}&language=id&sortBy=publishedAt&pageSize=24&apiKey=${API_KEY}`;
      const res  = await fetch(url);

      if (res.status === 426) throw new Error('Upgrade plan diperlukan untuk request ini');
      if (res.status === 401) throw new Error('API key tidak valid');
      if (res.status === 429) throw new Error('Limit request tercapai, coba lagi nanti');
      if (!res.ok) throw new Error('Request gagal');

      const data = await res.json();
      if (data.status === 'error') throw new Error(data.message || 'Request gagal');

      console.log(`[WIRE.ID] kategori=${cat} totalResults=${data.totalResults} articles=${data.articles?.length}`, data.articles);

      let list = data.articles || [];

      // Lapis pengaman tambahan: NewsAPI kadang tetap longgar mencocokkan
      // AND/OR, jadi kita saring lagi di sisi client — artikel harus benar2
      // mengandung salah satu keyword kategori di title/description-nya.
      if (cfg?.keywords) {
        const filtered = list.filter((a) => {
          const text = `${a.title || ''} ${a.description || ''}`.toLowerCase();
          return cfg.keywords.some((kw) => text.includes(kw.toLowerCase()));
        });
        // Kalau hasil saringan terlalu sedikit, lebih baik tetap tampilkan
        // hasil asli daripada layar kosong.
        list = filtered.length >= 3 ? filtered : list;
      }

      if (!list.length) { setArticles([]); setStatus('empty'); return; }
      setArticles(list);
      setStatus('ok');
    } catch (err) {
      console.error(err);
      setArticles([]);
      setErrorMsg(err.message || 'Gagal mengambil data');
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    fetchNews(category).finally(() => setSecondsToRefresh(REFRESH_SECONDS));
  }, [category, fetchNews]);

  // Auto-refresh countdown
  useEffect(() => {
    countdownRef.current = setInterval(() => {
      setSecondsToRefresh((s) => {
        if (s <= 1) { fetchNews(category); return REFRESH_SECONDS; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(countdownRef.current);
  }, [category, fetchNews]);

  const headlines  = articles.slice(0, 8).map((a) => a.title);
  const [hero, ...rest] = articles;
  const sideItems  = rest.slice(0, 4);
  const gridItems  = rest.slice(4);

  return (
    /*
     * Root: white canvas, ink body, SF Pro stack.
     * Top padding = 44px (StatusBar) + 44px (SubNav) = 88px
     */
    <div
      style={{
        backgroundColor: '#ffffff',
        color: '#1d1d1f',
        fontFamily: 'SF Pro Text, system-ui, -apple-system, sans-serif',
        minHeight: '100dvh',
      }}
    >
      {/* ── Status bar (global nav slot) ── */}
      <StatusBar secondsToRefresh={secondsToRefresh} clock={clock} />

      {/* ── Sub-nav frosted ── */}
      <div
        className="fixed left-0 right-0 z-40 flex items-center justify-between px-5"
        style={{
          top: '44px',
          height: '52px',
          backgroundColor: 'rgba(245,245,247,0.80)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <span className="flex items-center gap-2">
          <span
            style={{
              fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif',
              fontSize: '21px',
              fontWeight: 600,
              letterSpacing: '0.231px',
              color: '#1d1d1f',
              lineHeight: 1.19,
            }}
          >
            WIRE<span style={{ color: '#0066cc' }}>.ID</span>
          </span>
          <span
            style={{
              fontFamily: 'SF Pro Text, system-ui, -apple-system, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '-0.12px',
              color: '#7a7a7a',
              backgroundColor: 'rgba(0,0,0,0.06)',
              borderRadius: '9999px',
              padding: '3px 9px',
              whiteSpace: 'nowrap',
            }}
          >
            🇮🇩 {new Date().getFullYear()}
          </span>
        </span>

        {/* Category pills — utility size */}
        <nav
          className="flex items-center gap-1 overflow-x-auto"
          aria-label="Kategori berita"
          style={{ scrollbarWidth: 'none' }}
        >
          {CATEGORIES.map((c) => {
            const active = category === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className="transition-transform active:scale-95 shrink-0"
                style={{
                  backgroundColor: active ? '#1d1d1f' : 'transparent',
                  color:           active ? '#ffffff' : '#1d1d1f',
                  borderRadius:    '9999px',
                  padding:         '8px 15px',
                  fontFamily:      'SF Pro Text, system-ui, -apple-system, sans-serif',
                  fontSize:        '14px',
                  fontWeight:      400,
                  lineHeight:      1.29,
                  letterSpacing:   '-0.224px',
                  border:          active ? 'none' : '1px solid rgba(0,0,0,0.08)',
                  cursor:          'pointer',
                  outline:         'none',
                  whiteSpace:      'nowrap',
                }}
                onFocus={(e) => (e.target.style.outline = '2px solid #0071e3')}
                onBlur={(e)  => (e.target.style.outline = 'none')}
              >
                {c.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Ticker ── */}
      <div style={{ paddingTop: '96px' }}>
        <Ticker headlines={headlines} />
      </div>

      {/* ── State notices ── */}
      {status === 'no-key' && (
        <Notice>
          Belum ada API key. Daftar gratis di newsapi.org, lalu isi{' '}
          <code>VITE_NEWS_API_KEY</code> di file .env supaya berita bisa tampil.
        </Notice>
      )}
      {status === 'error' && (
        <Notice>
          Gagal mengambil data{errorMsg ? `: ${errorMsg}` : ''}. Cek API key atau koneksi internet kamu.
        </Notice>
      )}
      {status === 'empty' && (
        <Notice>Tidak ada berita untuk kategori ini saat ini.</Notice>
      )}

      {/* ── Main content ── */}
      <main>
        {status === 'loading' && articles.length === 0 ? (
          /* Skeleton grid */
          <div
            className="mx-auto px-5 py-20"
            style={{ maxWidth: '980px' }}
          >
            <div
              className="grid gap-6"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        ) : articles.length === 0 ? (
          <Notice>Belum ada berita untuk ditampilkan.</Notice>
        ) : (
          <>
            {/* ── Tile 1 — Light: Hero ── */}
            <HeroSection article={hero} />

            {/* ── Tile 2 — Dark: Top ranked side list ── */}
            {sideItems.length > 0 && (
              <section
                style={{
                  backgroundColor: '#272729',
                  paddingTop: '80px',
                  paddingBottom: '80px',
                }}
              >
                <div className="mx-auto px-5" style={{ maxWidth: '980px' }}>
                  {/* Section eyebrow */}
                  <p
                    className="mb-8"
                    style={{
                      fontFamily: 'SF Pro Text, system-ui, -apple-system, sans-serif',
                      fontSize: '14px',
                      fontWeight: 600,
                      letterSpacing: '-0.224px',
                      color: '#7a7a7a',
                      lineHeight: 1.29,
                      textTransform: 'uppercase',
                    }}
                  >
                    Sorotan
                  </p>
                  <div className="divide-y divide-white/5">
                    {sideItems.map((a, i) => (
                      <SideItem article={a} index={i} key={i} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ── Tile 3 — Parchment: Grid ── */}
            {gridItems.length > 0 && (
              <section
                style={{
                  backgroundColor: '#f5f5f7',
                  paddingTop: '80px',
                  paddingBottom: '80px',
                }}
              >
                <div className="mx-auto px-5" style={{ maxWidth: '1440px' }}>
                  <p
                    className="mb-8"
                    style={{
                      fontFamily: 'SF Pro Text, system-ui, -apple-system, sans-serif',
                      fontSize: '14px',
                      fontWeight: 600,
                      letterSpacing: '-0.224px',
                      color: '#7a7a7a',
                      lineHeight: 1.29,
                      textTransform: 'uppercase',
                    }}
                  >
                    Semua Berita
                  </p>
                  <div
                    className="grid gap-6"
                    style={{
                      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    }}
                  >
                    {gridItems.map((a, i) => (
                      <NewsCard article={a} key={i} />
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* ── Footer — parchment, dense-link typography ── */}
      <footer
        style={{
          backgroundColor: '#f5f5f7',
          padding: '64px 20px',
          borderTop: '1px solid #e0e0e0',
        }}
      >
        <div
          className="mx-auto flex flex-col gap-2 text-center"
          style={{ maxWidth: '980px' }}
        >
          <p
            style={{
              fontFamily: 'SF Pro Display, system-ui, -apple-system, sans-serif',
              fontSize: '21px',
              fontWeight: 600,
              letterSpacing: '0.231px',
              color: '#1d1d1f',
            }}
          >
            WIRE<span style={{ color: '#0066cc' }}>.ID</span>
          </p>
          <p
            style={{
              fontFamily: 'SF Pro Text, system-ui, -apple-system, sans-serif',
              fontSize: '12px',
              fontWeight: 400,
              letterSpacing: '-0.12px',
              color: '#7a7a7a',
              lineHeight: 1.0,
            }}
          >
            Data oleh NewsAPI.org &middot; Auto-refresh setiap {REFRESH_SECONDS} detik
          </p>
        </div>
      </footer>
    </div>
  );
}