import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { COMPLAINT_CATEGORIES, STATUS_STYLES } from '../../utils/constants';

const DEFAULT_CENTER = [22.7196, 75.8577];

export default function ComplaintMap({ complaints = [], height = 420 }) {
  const center =
    complaints.length > 0
      ? [complaints[0].latitude, complaints[0].longitude]
      : DEFAULT_CENTER;

  return (
    <div style={{ height }} className="overflow-hidden rounded-xl">
      <MapContainer center={center} zoom={13} className="h-full w-full">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {complaints.map((c) => {
          const category = COMPLAINT_CATEGORIES.find((cat) => cat.value === c.category);
          const status = STATUS_STYLES[c.status];
          return (
            <Marker key={c.id} position={[c.latitude, c.longitude]}>
              <Popup>
                <div className="min-w-[180px] space-y-1">
                  <p className="font-semibold">
                    {category?.icon} {c.title}
                  </p>
                  <p className="text-xs text-ink-400">{c.address}</p>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs ${status?.className}`}>
                    {status?.label}
                  </span>
                  <Link
                    to={`/citizen/complaints/${c.id}`}
                    className="block pt-1 text-xs font-semibold text-pulse-600 hover:underline"
                  >
                    View details →
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
