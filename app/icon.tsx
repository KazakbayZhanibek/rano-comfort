import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#040404',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '80%',
            height: '80%',
            borderRadius: '50%',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 0 6px rgba(0,0,0,0.08)',
          }}
        >
          <span
            style={{
              color: '#111111',
              fontSize: 18,
              fontWeight: 800,
              fontFamily: 'sans-serif',
            }}
          >
            R
          </span>
        </div>
      </div>
    ),
    { ...size }
  )
}
