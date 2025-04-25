
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';

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
  const [tokenError, setTokenError] = useState<string | null>(null);

  const validateToken = (token: string): boolean => {
    // Verify the token starts with "pk." as required by Mapbox GL for public tokens
    return token.startsWith('pk.');
  };

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mapboxToken) {
      setTokenError('Please enter a Mapbox token');
      return;
    }
    
    if (!validateToken(mapboxToken)) {
      setTokenError('Invalid token format. Mapbox GL requires a public access token (starting with pk.)');
      return;
    }
    
    // Valid token, proceed
    setTokenError(null);
    localStorage.setItem('mapbox_token', mapboxToken);
    setIsTokenSet(true);
    toast({
      title: "Success",
      description: "Mapbox token set successfully",
    });
    initializeMap();
  };

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    // Validate token before using
    if (!validateToken(mapboxToken)) {
      setTokenError('Invalid token format. Mapbox GL requires a public access token (starting with pk.)');
      setIsTokenSet(false);
      return;
    }

    // Set token and initialize map
    mapboxgl.accessToken = mapboxToken;
    
    if (map.current) return;

    try {
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
    } catch (error) {
      console.error('Error initializing map:', error);
      setTokenError('Error initializing map. Please check your token.');
      setIsTokenSet(false);
      localStorage.removeItem('mapbox_token');
    }
  };

  // Clear token and reset form
  const handleReset = () => {
    localStorage.removeItem('mapbox_token');
    setMapboxToken('');
    setIsTokenSet(false);
    setTokenError(null);
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
  };

  useEffect(() => {
    if (isTokenSet) {
      // Check if stored token is valid before initialization
      if (validateToken(mapboxToken)) {
        initializeMap();
      } else {
        setTokenError('Invalid token format. Mapbox GL requires a public access token (starting with pk.)');
        setIsTokenSet(false);
        localStorage.removeItem('mapbox_token');
      }
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
          Please enter your Mapbox <strong>public</strong> token to view the map. You can get one at mapbox.com
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Note: The token must start with <code className="bg-gray-100 p-1 rounded">pk.</code> (Mapbox public token)
        </p>
        {tokenError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{tokenError}</p>
          </div>
        )}
        <form onSubmit={handleTokenSubmit} className="space-y-4">
          <Input
            type="text"
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            placeholder="Enter your Mapbox public token (pk.*)"
            className="w-full"
          />
          <div className="flex space-x-2">
            <Button type="submit">Set Token</Button>
            {localStorage.getItem('mapbox_token') && (
              <Button type="button" variant="outline" onClick={handleReset}>Reset</Button>
            )}
          </div>
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
