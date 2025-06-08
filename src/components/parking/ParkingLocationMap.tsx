
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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
  
  const initializeMap = () => {
    if (!mapContainer.current) return;
    
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    
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
    }
  };

  useEffect(() => {
    initializeMap();
    
    return () => {
      map.current = null;
    };
  }, [location]);

  return (
    <div className="h-full rounded-lg overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default ParkingLocationMap;
