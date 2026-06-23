function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'baru saja';
  if (mins < 60) return `${mins} menit lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}

/**
 * NewsCard — store-utility-card pattern from DESIGN.md
 *
 * Token refs:
 *   background   → colors.canvas          #ffffff
 *   border       → colors.hairline         #e0e0e0  (1px)
 *   radius       → rounded.lg              18px
 *   padding      → spacing.lg              24px
 *   source       → typography.caption-strong (14/600/1.29/−0.224px) + colors.primary #0066cc
 *   title        → typography.body-strong   (17/600/1.24/−0.374px)
 *   meta         → typography.caption       (14/400/1.43/−0.224px)  + colors.ink-muted-48 #7a7a7a
 *   cta          → text-link               colors.primary
 *   active press → transform: scale(0.95)
 *   shadow rule  → NO card shadow (shadow belongs to product photography only)
 */
export default function NewsCard({ article }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col transition-transform active:scale-95"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e0e0e0',
        borderRadius: '18px',
        overflow: 'hidden',
        textDecoration: 'none',
        outline: 'none',
      }}
      onFocus={(e) => (e.currentTarget.style.outline = '2px solid #0071e3')}
      onBlur={(e)  => (e.currentTarget.style.outline = 'none')}
    >
      {/* 1:1 product image area */}
      <div className="w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <img
          src={
            article.urlToImage ||
            'https://placehold.co/400x225/f5f5f7/1d1d1f?text=WIRE.ID'
          }
          alt=""
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          onError={(e) => {
            e.target.src = 'https://placehold.co/400x225/f5f5f7/1d1d1f?text=WIRE.ID';
          }}
        />
      </div>

      {/* Card body — 24px padding all sides */}
      <div
        className="flex flex-col flex-1"
        style={{ padding: '24px' }}
      >
        {/* Source — caption-strong + Action Blue */}
        <span
          className="mb-2 block"
          style={{
            fontFamily:    'SF Pro Text, system-ui, -apple-system, sans-serif',
            fontSize:      '14px',
            fontWeight:    600,
            lineHeight:    1.29,
            letterSpacing: '-0.224px',
            color:         '#0066cc',
          }}
        >
          {article.source?.name || 'Sumber tidak diketahui'}
        </span>

        {/* Title — body-strong */}
        <h3
          className="flex-1 mb-4"
          style={{
            fontFamily:    'SF Pro Text, system-ui, -apple-system, sans-serif',
            fontSize:      '17px',
            fontWeight:    600,
            lineHeight:    1.24,
            letterSpacing: '-0.374px',
            color:         '#1d1d1f',
            margin:        0,
          }}
        >
          {article.title}
        </h3>

        {/* Footer row: time ago + text-link CTA */}
        <div className="flex items-center justify-between mt-auto pt-4"
          style={{ borderTop: '1px solid #f0f0f0' }}
        >
          <span
            style={{
              fontFamily:    'SF Pro Text, system-ui, -apple-system, sans-serif',
              fontSize:      '14px',
              fontWeight:    400,
              lineHeight:    1.43,
              letterSpacing: '-0.224px',
              color:         '#7a7a7a',
            }}
          >
            {timeAgo(article.publishedAt)}
          </span>

          {/* Text link — Action Blue, no underline by default */}
          <span
            style={{
              fontFamily:    'SF Pro Text, system-ui, -apple-system, sans-serif',
              fontSize:      '17px',
              fontWeight:    400,
              lineHeight:    1.47,
              letterSpacing: '-0.374px',
              color:         '#0066cc',
            }}
          >
            Baca →
          </span>
        </div>
      </div>
    </a>
  );
}

export { timeAgo };