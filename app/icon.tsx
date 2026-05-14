import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
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
          src="http://localhost:3000/logo.png"
          width={400}
          height={400}
          style={{ borderRadius: '50%', objectFit: 'cover' }}
        />
      </div>
    ),
    { ...size }
  )
}
