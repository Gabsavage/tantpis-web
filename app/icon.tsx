import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

/**
 * Dynamic favicon: 32×32 terra square with "TP" in cream, italic serif.
 * Next.js automatically wires this up as the site favicon.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#C2604A',
          color: '#F2E8DC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          fontWeight: 500,
          fontStyle: 'italic',
          letterSpacing: '-0.04em',
          fontFamily: '"Times New Roman", serif',
        }}
      >
        TP
      </div>
    ),
    { ...size }
  );
}
