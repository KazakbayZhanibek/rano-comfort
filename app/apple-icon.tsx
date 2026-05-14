import { ImageResponse } from 'next/og'

export const dynamic = 'force-dynamic'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  return new ImageResponse(
    (
      <div style={{
        width: 180, 
        height: 180,
        borderRadius: 40,
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <img
          src={`${baseUrl}/logo.png`}
          width={500}
          height={500}
          style={{ borderRadius: 40, objectFit: 'cover' }}
        />
      </div>
    ),
    { ...size }
  )
}
