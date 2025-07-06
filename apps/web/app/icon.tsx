import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: '#5D1E26',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#B8941F',
          fontFamily: 'serif',
          fontWeight: 'bold',
          borderRadius: '6px',
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
