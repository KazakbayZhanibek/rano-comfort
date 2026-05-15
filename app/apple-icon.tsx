import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 40,
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
        }}
      >
        <div
          style={{
            width: '82%',
            height: '82%',
            borderRadius: 32,
            background: '#0a4f84',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              color: '#ffffff',
              fontSize: 76,
              fontWeight: 900,
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
