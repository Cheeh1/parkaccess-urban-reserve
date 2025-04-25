
import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface MapboxTokenManagerProps {
  onTokenSet: (token: string) => void;
}

const MapboxTokenManager = ({ onTokenSet }: MapboxTokenManagerProps) => {
  const [mapboxToken, setMapboxToken] = useState(localStorage.getItem('mapbox_token') || '');
  const [tokenError, setTokenError] = useState<string | null>(null);
  const { toast } = useToast();

  const validateToken = (token: string): boolean => {
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
    
    setTokenError(null);
    localStorage.setItem('mapbox_token', mapboxToken);
    onTokenSet(mapboxToken);
    toast({
      title: "Success",
      description: "Mapbox token set successfully",
    });
  };

  const handleReset = () => {
    localStorage.removeItem('mapbox_token');
    setMapboxToken('');
    setTokenError(null);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Set Mapbox Token</h3>
      <p className="text-sm text-gray-600 mb-4">
        Please enter your Mapbox <strong>public</strong> token to view the map. You can get one at mapbox.com
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
};

export default MapboxTokenManager;
