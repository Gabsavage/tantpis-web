import Image from 'next/image';
import { promises as fs } from 'fs';
import path from 'path';

type PlaceholderImageProps = {
  src: string;
  alt: string;
  /** e.g. "16/9", "3/4", "3/2", "1/1" */
  aspect: string;
  /** Hex color used while no real photo exists yet. */
  fallbackColor: string;
  /** Width/height shown in the placeholder label so design slots are obvious. */
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  /** When true, label is hidden (used for very small placeholders e.g. avatars). */
  hideLabel?: boolean;
};

function tinyBlurDataURL(hex: string): string {
  // 1×1 SVG with solid fill — keeps next/image happy without bundling images.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="1" height="1" fill="${hex}"/></svg>`;
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

async function fileExists(publicSrc: string): Promise<boolean> {
  try {
    const abs = path.join(process.cwd(), 'public', publicSrc.replace(/^\//, ''));
    await fs.access(abs);
    return true;
  } catch {
    return false;
  }
}

/**
 * Renders next/image when the file exists in /public, otherwise a coloured
 * placeholder with the matching aspect ratio + a slot label. Lets us design
 * the layout before final photos arrive without 404s in the console.
 */
export default async function PlaceholderImage({
  src,
  alt,
  aspect,
  fallbackColor,
  width,
  height,
  className = '',
  priority = false,
  sizes = '100vw',
  hideLabel = false,
}: PlaceholderImageProps) {
  const exists = await fileExists(src);
  const aspectStyle = { aspectRatio: aspect.replace('/', ' / ') };

  if (exists) {
    return (
      <div
        className={`relative overflow-hidden ${className}`}
        style={aspectStyle}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          placeholder="blur"
          blurDataURL={tinyBlurDataURL(fallbackColor)}
          className="object-cover"
        />
      </div>
    );
  }

  // No file yet — render slot.
  const filename = src.split('/').pop();
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ ...aspectStyle, backgroundColor: fallbackColor }}
      role="img"
      aria-label={alt}
    >
      {/* subtle diagonal lines to read as "placeholder" */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, rgba(255,255,255,0.6) 0 1px, transparent 1px 14px)',
        }}
      />
      {!hideLabel && (
        <div className="absolute inset-0 flex items-end justify-between p-4 md:p-6">
          <span className="font-sans text-[0.6rem] uppercase tracking-[0.22em] text-ink/50">
            {filename}
          </span>
          <span className="font-sans text-[0.6rem] uppercase tracking-[0.22em] text-ink/50">
            {width}×{height}
          </span>
        </div>
      )}
    </div>
  );
}
