
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface ParkingLocation {
  id: string;
  name: string;
  address: string;
  coordinates?: [number, number];
}

interface ParkingMapProps {
  locations: ParkingLocation[];
}

const ParkingMap = ({ locations }: ParkingMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { toast } = useToast();
  const [mapboxToken, setMapboxToken] = useState(localStorage.getItem('mapbox_token') || '');
  const [isTokenSet, setIsTokenSet] = useState(!!localStorage.getItem('mapbox_token'));

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mapboxToken) {
      localStorage.setItem('mapbox_token', mapboxToken);
      setIsTokenSet(true);
      toast({
        title: "Success",
        description: "Mapbox token set successfully",
      });
      initializeMap();
    }
  };

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    // Set token and initialize map
    mapboxgl.accessToken = mapboxToken;
    
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [4.5418, 8.5433], // Center on Ilorin
      zoom: 12,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add markers for each location
    locations.forEach((location) => {
      // For demo, generate random coordinates around Ilorin if not provided
      const coordinates = location.coordinates || [
        4.5418 + (Math.random() - 0.5) * 0.1,
        8.5433 + (Math.random() - 0.5) * 0.1
      ];

      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <strong>${location.name}</strong>
          <p>${location.address}</p>
        `);

      new mapboxgl.Marker()
        .setLngLat(coordinates)
        .setPopup(popup)
        .addTo(map.current!);
    });
  };

  useEffect(() => {
    if (isTokenSet) {
      initializeMap();
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [isTokenSet, locations]);

  if (!isTokenSet) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Set Mapbox Token</h3>
        <p className="text-sm text-gray-600 mb-4">
          Please enter your Mapbox public token to view the map. You can get one at mapbox.com
        </p>
        <form onSubmit={handleTokenSubmit} className="space-y-4">
          <Input
            type="text"
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            placeholder="Enter your Mapbox public token"
            className="w-full"
          />
          <Button type="submit">Set Token</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="h-[400px] rounded-lg overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default ParkingMap;
