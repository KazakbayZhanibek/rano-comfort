import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
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
          src="http://localhost:3000/logo.png"
          width={500}
          height={500}
          style={{ borderRadius: 40, objectFit: 'cover' }}
        />
      </div>
    ),
    { ...size }
  )
}
