import { useState, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { LocateFixed, Search } from 'lucide-react';
import { reverseGeocode, searchAddress } from '../../utils/geocoding';
import Input from '../common/Input.jsx';

// Fix default marker icons (Leaflet + Vite bundling quirk)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const DEFAULT_CENTER = [22.7196, 75.8577]; // Indore, India

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function RecenterMap({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 16);
  }, [position, map]);
  return null;
}

export default function MapPicker({ value, onChange, height = 320 }) {
  const [position, setPosition] = useState(value || null);
  const [address, setAddress] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [resolving, setResolving] = useState(false);

  const applyPosition = useCallback(
    async (lat, lng) => {
      setPosition({ lat, lng });
      setResolving(true);
      try {
        const label = await reverseGeocode(lat, lng);
        setAddress(label);
        onChange?.({ lat, lng, address: label });
      } catch {
        onChange?.({ lat, lng, address: '' });
      } finally {
        setResolving(false);
      }
    },
    [onChange]
  );

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      applyPosition(pos.coords.latitude, pos.coords.longitude);
    });
  };

  const handleSearch = async (e) => {
    const q = e.target.value;
    setQuery(q);
    if (q.trim().length < 3) {
      setResults([]);
      return;
    }
    const matches = await searchAddress(q);
    setResults(matches);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Input
          icon={Search}
          placeholder="Search for a street, landmark, or area…"
          value={query}
          onChange={handleSearch}
        />
        {results.length > 0 && (
          <ul className="absolute z-[1000] mt-1 w-full rounded-lg border border-ink-100 bg-white shadow-raised dark:border-ink-800 dark:bg-ink-800">
            {results.map((r) => (
              <li key={`${r.lat}-${r.lon}`}>
                <button
                  type="button"
                  className="block w-full truncate px-3 py-2 text-left text-sm hover:bg-ink-100 dark:hover:bg-ink-700"
                  onClick={() => {
                    applyPosition(r.lat, r.lon);
                    setQuery(r.label);
                    setResults([]);
                  }}
                >
                  {r.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ height }} className="relative overflow-hidden rounded-xl">
        <MapContainer
          center={position ? [position.lat, position.lng] : DEFAULT_CENTER}
          zoom={position ? 16 : 12}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onPick={applyPosition} />
          {position && (
            <>
              <Marker position={[position.lat, position.lng]} />
              <RecenterMap position={[position.lat, position.lng]} />
            </>
          )}
        </MapContainer>

        <button
          type="button"
          onClick={useMyLocation}
          className="absolute bottom-3 right-3 z-[1000] flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-semibold shadow-raised hover:bg-ink-100 dark:bg-ink-800 dark:hover:bg-ink-700"
        >
          <LocateFixed size={14} />
          Use my location
        </button>
      </div>

      <p className="text-xs text-ink-400">
        {resolving
          ? 'Resolving address…'
          : address || 'Click on the map or search above to pin the exact issue location.'}
      </p>
    </div>
  );
}
