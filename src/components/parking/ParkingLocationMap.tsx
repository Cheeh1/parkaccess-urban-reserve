
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxTokenManager from './MapboxTokenManager';

interface ParkingLocationMapProps {
  location: {
    name: string;
    address: string;
    coordinates: [number, number];
  };
}

const ParkingLocationMap = ({ location }: ParkingLocationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isTokenSet, setIsTokenSet] = useState(!!localStorage.getItem('mapbox_token'));
  // Track if the component is mounted
  const isMounted = useRef(true);

  const initializeMap = () => {
    if (!mapContainer.current) return;

    const token = localStorage.getItem('mapbox_token');
    if (!token) return;

    mapboxgl.accessToken = token;
    
    if (map.current) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: location.coordinates,
        zoom: 15,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <strong>${location.name}</strong>
          <p>${location.address}</p>
        `);

      new mapboxgl.Marker()
        .setLngLat(location.coordinates)
        .setPopup(popup)
        .addTo(map.current);

    } catch (error) {
      console.error('Error initializing map:', error);
      localStorage.removeItem('mapbox_token');
      setIsTokenSet(false);
    }
  };

  const handleTokenSet = (token: string) => {
    setIsTokenSet(true);
  };

  useEffect(() => {
    isMounted.current = true;
    
    if (isTokenSet) {
      initializeMap();
    }

    return () => {
      isMounted.current = false;
      
      // Safely nullify the map instance without calling remove()
      // This avoids the "indoor" error by skipping the problematic removal method
      map.current = null;
    };
  }, [isTokenSet, location]);

  if (!isTokenSet) {
    return <MapboxTokenManager onTokenSet={handleTokenSet} />;
  }

  return (
    <div className="h-full rounded-lg overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default ParkingLocationMap;
