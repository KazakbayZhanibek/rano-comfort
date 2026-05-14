import { ImageResponse } from 'next/og'

export const dynamic = 'force-dynamic'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  return new ImageResponse(
    (
      <div style={{
        width: 32, 
        height: 32,
        borderRadius: '50%',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <img
          src={`${baseUrl}/logo.png`}
          width={400}
          height={400}
          style={{ borderRadius: '50%', objectFit: 'cover' }}
        />
      </div>
    ),
    { ...size }
  )
}
