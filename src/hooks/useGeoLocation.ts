import { useEffect, useState } from 'react';

interface Coords {
  latitude: number;
  longitude: number;
}

const useGeolocation = () => {
  const [location, setLocation] = useState<Coords>({latitude:0,longitude:0});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getLocation = () => {
      return new Promise<void>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by your browser'));
        } else {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              const coords: Coords = { latitude, longitude };
              setLocation(coords);
              resolve();
            },
            (error) => {
              setError(error.message);
              reject(error);
            }
          );
        }
      });
    };

    getLocation()
  }, []);

  return { location, error };
};

export default useGeolocation;
