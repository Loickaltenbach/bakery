import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 120,
          background: '#5D1E26',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#B8941F',
          fontFamily: 'serif',
          fontWeight: 'bold',
          borderRadius: '20px',
          boxShadow: '0 4px 12px rgba(93, 30, 38, 0.3)',
        }}
      >
        F
      </div>
    ),
    {
      ...size,
    }
  )
}
