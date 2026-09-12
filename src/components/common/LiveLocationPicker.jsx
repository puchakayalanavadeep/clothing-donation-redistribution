import React, { useState } from 'react';
import { MapPin, Navigation, Compass, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';

export default function LiveLocationPicker({ locationData, onChangeLocation }) {
  const [locating, setLocating] = useState(false);
  const [gpsStatus, setGpsStatus] = useState(null); // { type: 'success' | 'error', text: '' }
  const [coords, setCoords] = useState(
    locationData?.lat && locationData?.lng 
      ? { lat: locationData.lat, lng: locationData.lng } 
      : { lat: 12.9716, lng: 77.5946 } // Default Bengaluru coordinates
  );

  const detectLiveLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus({
        type: 'error',
        text: 'Geolocation is not supported by your browser.'
      });
      return;
    }

    setLocating(true);
    setGpsStatus(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const accuracy = Math.round(position.coords.accuracy);

        setCoords({ lat: latitude, lng: longitude });

        try {
          // Reverse geocode via OpenStreetMap Nominatim API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          if (data && data.address) {
            const addr = data.address;
            const detectedAddress = [addr.house_number, addr.road, addr.suburb || addr.neighbourhood]
              .filter(Boolean)
              .join(', ') || data.display_name.split(',')[0];
            const detectedCity = addr.city || addr.town || addr.village || addr.county || 'Bengaluru';
            const detectedState = addr.state || 'Karnataka';
            const detectedPincode = addr.postcode || '560038';

            onChangeLocation({
              address: detectedAddress,
              city: detectedCity,
              state: detectedState,
              pincode: detectedPincode,
              lat: latitude,
              lng: longitude
            });

            setGpsStatus({
              type: 'success',
              text: `Live GPS position detected (±${accuracy}m accuracy): ${detectedCity}, ${detectedState}`
            });
          } else {
            onChangeLocation({
              ...locationData,
              lat: latitude,
              lng: longitude
            });
            setGpsStatus({
              type: 'success',
              text: `GPS coordinates captured: ${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`
            });
          }
        } catch (err) {
          console.warn('Reverse geocoding failed, using coordinates:', err);
          onChangeLocation({
            ...locationData,
            lat: latitude,
            lng: longitude
          });
          setGpsStatus({
            type: 'success',
            text: `Live GPS acquired: ${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`
          });
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMsg = 'Could not access live location. Please check browser permissions.';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Location access permission denied. Please allow location access in your browser.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = 'GPS location unavailable. Using approximate location.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = 'GPS detection timed out. Please try clicking again.';
        }

        // Fallback default coordinates
        setGpsStatus({ type: 'error', text: errorMsg });
        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const mapBbox = `${coords.lng - 0.01},${coords.lat - 0.01},${coords.lng + 0.01},${coords.lat + 0.01}`;
  const iframeSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${mapBbox}&layer=mapnik&marker=${coords.lat},${coords.lng}`;

  return (
    <div className="space-y-4">
      {/* Live Location Trigger Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
            <Compass className={`w-5 h-5 ${locating ? 'animate-spin text-emerald-300' : ''}`} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Automatic GPS Detection</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
                Live GPS
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Fetch exact latitude, longitude, address & pincode automatically
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={detectLiveLocation}
          disabled={locating}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs transition-all shadow-md shadow-emerald-950/40 flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
        >
          {locating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Acquiring GPS Signal...</span>
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4 fill-slate-950" />
              <span>Detect My Live Location</span>
            </>
          )}
        </button>
      </div>

      {/* GPS Status Banner */}
      {gpsStatus && (
        <div
          className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2.5 ${
            gpsStatus.type === 'success'
              ? 'bg-emerald-950/60 text-emerald-200 border border-emerald-800/80'
              : 'bg-amber-950/60 text-amber-200 border border-amber-800/80'
          }`}
        >
          {gpsStatus.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span>{gpsStatus.text}</span>
        </div>
      )}

      {/* Interactive Map Container */}
      <div className="relative h-56 rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 shadow-inner group">
        <iframe
          title="Live Pickup Location Map"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight="0"
          marginWidth="0"
          src={iframeSrc}
          className="w-full h-full filter contrast-105 opacity-90 transition-opacity group-hover:opacity-100"
        />

        {/* Live Coordinate Overlay Badge */}
        <div className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[10px] font-mono font-bold text-slate-300 flex items-center gap-2 shadow-lg">
          <MapPin className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>
            {coords.lat.toFixed(4)}° N, {coords.lng.toFixed(4)}° E
          </span>
        </div>
      </div>
    </div>
  );
}
