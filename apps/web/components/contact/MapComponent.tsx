import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { LatLngExpression } from 'leaflet'

// Fix pour les icônes Leaflet avec Next.js
import L from 'leaflet'
delete (L.Icon.Default.prototype as any)._getIconUrl

// Icône personnalisée pour la boulangerie
const boulangerieIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// Coordonnées de Souffelweyersheim - Centre ville
const BOULANGERIE_COORDS: LatLngExpression = [48.6352424621582, 7.740969657897949] // Coordonnées précises du centre de Souffelweyersheim

export default function MapComponent() {
  return (
    <MapContainer
      center={BOULANGERIE_COORDS}
      zoom={15}
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={BOULANGERIE_COORDS}>
        <Popup>
          <div className="text-center">
            <h3 className="font-semibold text-boulangerie-bordeaux mb-1">
              Boulangerie Fabrice's
            </h3>
            <p className="text-sm text-gray-600">
              2 rue du centre<br />
              67460 Souffelweyersheim
            </p>
            <div className="mt-2">
              <a
                href="https://maps.google.com/?q=2+rue+du+centre,+67460+Souffelweyersheim"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-boulangerie-or hover:text-boulangerie-or-dark underline"
              >
                Ouvrir dans Google Maps
              </a>
            </div>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  )
}
