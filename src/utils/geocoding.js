const NOMINATIM_URL =
  import.meta.env.VITE_NOMINATIM_BASE_URL || 'https://nominatim.openstreetmap.org';

// Reverse geocode: lat/lng -> human-readable address.
export async function reverseGeocode(lat, lon) {
  const res = await fetch(
    `${NOMINATIM_URL}/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
    { headers: { 'Accept-Language': 'en' } }
  );
  if (!res.ok) throw new Error('Could not resolve address for this location.');
  const data = await res.json();
  return data.display_name || `${lat}, ${lon}`;
}

// Forward geocode: search text -> list of matching places.
export async function searchAddress(query) {
  if (!query || query.trim().length < 3) return [];
  const res = await fetch(
    `${NOMINATIM_URL}/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`,
    { headers: { 'Accept-Language': 'en' } }
  );
  if (!res.ok) throw new Error('Address search failed.');
  const data = await res.json();
  return data.map((d) => ({
    label: d.display_name,
    lat: parseFloat(d.lat),
    lon: parseFloat(d.lon),
  }));
}
