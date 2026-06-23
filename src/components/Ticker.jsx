/**
 * Ticker — running headline bar, sits directly below the frosted sub-nav.
 *
 * Token refs:
 *   background   → colors.surface-black    #000000
 *   label bg     → colors.primary          #0066cc  (pill badge)
 *   label text   → colors.on-primary       #ffffff
 *   label radius → rounded.pill            9999px
 *   label type   → typography.caption-strong (14/600/1.29/−0.224px)
 *   item text    → colors.body-muted        #cccccc
 *   item type    → typography.nav-link      (12/400/1.0/−0.12px)
 *   separator    → colors.primary-on-dark   #2997ff  (·)
 *   height       → 36px  (between nav-link and sub-nav tokens)
 *
 * Animation: CSS marquee via @keyframes — no JS scroll listener,
 * no useState on position (DESIGN.md: use CSS for this, not JS).
 * Respects prefers-reduced-motion: pauses the animation.
 */
export default function Ticker({ headlines }) {
  if (!headlines || headlines.length === 0) return null;

  // Triple-duplicate so seamless even on very wide screens
  const loop = [...headlines, ...headlines, ...headlines];

  return (
    <>
      <style>{`
        @keyframes wire-ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .wire-ticker-track { animation-play-state: paused !important; }
        }
      `}</style>

      <div
        role="status"
        aria-label="Berita terbaru berjalan"
        className="flex items-center overflow-hidden"
        style={{
          backgroundColor: '#000000',
          height: '36px',
        }}
      >
        {/* Label badge — pill, Action Blue */}
        <div
          className="shrink-0 flex items-center z-10"
          style={{
            padding: '0 16px',
            borderRight: '1px solid rgba(255,255,255,0.08)',
            height: '100%',
          }}
        >
          <span
            style={{
              backgroundColor: '#0066cc',
              color:           '#ffffff',
              borderRadius:    '9999px',
              padding:         '3px 10px',
              fontFamily:      'SF Pro Text, system-ui, -apple-system, sans-serif',
              fontSize:        '12px',
              fontWeight:      600,
              lineHeight:      1.29,
              letterSpacing:   '-0.12px',
              whiteSpace:      'nowrap',
            }}
          >
            ⚡ TERKINI
          </span>
        </div>

        {/* Scrolling track */}
        <div className="flex-1 overflow-hidden relative">
          <div
            className="wire-ticker-track flex items-center"
            style={{
              animation: 'wire-ticker 40s linear infinite',
              width:     'max-content',
              gap:       '0px',
            }}
          >
            {loop.map((headline, i) => (
              <span
                key={i}
                className="inline-flex items-center"
                style={{
                  fontFamily:    'SF Pro Text, system-ui, -apple-system, sans-serif',
                  fontSize:      '12px',
                  fontWeight:    400,
                  lineHeight:    1.0,
                  letterSpacing: '-0.12px',
                  color:         '#cccccc',
                  whiteSpace:    'nowrap',
                  padding:       '0 20px',
                }}
              >
                {headline}
                {/* Sky Link Blue separator dot */}
                <span
                  style={{
                    color:      '#2997ff',
                    marginLeft: '20px',
                    fontSize:   '10px',
                  }}
                >
                  ●
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}