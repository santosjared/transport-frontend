import { FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { useEffect, useRef, useState } from 'react';
import type { FeatureCollection } from 'geojson';
import * as L from 'leaflet';
import axios from 'axios';

interface Props {
  geojson: FeatureCollection;
  setHandleChanges?: (arg: boolean) => void;
  setGeojson: (geojson: FeatureCollection) => void;
  isProcessingQueue: boolean;
  names: string[];
  setIsProcessingQueue: (state: boolean) => void;
  setNames: (names: string[]) => void;
}

const DrawMap = ({ geojson, setGeojson, setHandleChanges, isProcessingQueue, setIsProcessingQueue, names, setNames }: Props) => {
  const ref = useRef<L.FeatureGroup>(null);
  const [requestQueue, setRequestQueue] = useState<any[]>([]);
  useEffect(() => {
    if (!isProcessingQueue) {
      if (ref.current?.getLayers().length === 0 && geojson) {
        L.geoJSON(geojson).eachLayer((layer) => {
          if (layer instanceof L.Polyline || layer instanceof L.Marker) {
            ref.current?.addLayer(layer);
          }
        });
      }
    }
  }, [geojson]);

  const handleCreatedLine = async () => {
    const geo = ref.current?.toGeoJSON();
    if (geo?.type === 'FeatureCollection') {
      const updatedFeatures = await Promise.all(
        geo.features.map(async (feature) => {
          if (feature.geometry.type === 'LineString') {
            const coordinates = feature.geometry.coordinates as [number, number][];
            const streetNames = await Promise.all(
              coordinates.map(async (coord) => {
                const [lng, lat] = coord;
                const streetName = await getStreetName(lat, lng);
                return streetName;
              })
            );

            return {
              ...feature,
              properties: { street: streetNames },
            };
          }
          return feature;
        })
      );
      const updatedGeo = {
        ...geo,
        features: updatedFeatures,
      };
      if (setHandleChanges) {
        setHandleChanges(true);
      }
      setGeojson(updatedGeo);
    }
  };

  const handleCreateMarker = () => {
    const geo = ref.current?.toGeoJSON();
    if (geo?.type === 'FeatureCollection') {
      const updatedFeatures = geo.features.map((feature) => ({
        ...feature,
        properties: {
          ...feature.properties,
        },
      }));
      const updatedGeo = {
        ...geo,
        features: updatedFeatures,
      };
      if (setHandleChanges) {
        setHandleChanges(true);
      }

      setGeojson(updatedGeo);
    }
  }

  const processQueue = () => {
    setRequestQueue((prevQueue) => {
      if (prevQueue.length === 0) {
        setIsProcessingQueue(false);
        return prevQueue;
      }

      const { lat, lng, callback } = prevQueue[0];
      axios.get(`https://nominatim.openstreetmap.org/reverse`, {
        params: {
          format: 'jsonv2',
          lat: lat,
          lon: lng,
        }
      })
        .then((response) => {
          const street = response.data.address.road || null;
          callback(street);
        })
        .catch((err) => {
          callback(null);
        })
        .finally(() => {
          setTimeout(() => {
            processQueue();
          }, 1000);
        });

      return prevQueue.slice(1);
    });
  };

  const addToQueue = (lat: number, lng: number, callback: (street: string) => void) => {
    setRequestQueue((prevQueue) => {
      const newQueue = [...prevQueue, { lat, lng, callback }];
      if (!isProcessingQueue) {
        setIsProcessingQueue(true);
        processQueue();
      }
      return newQueue;
    });
  };

  const getStreetName = (lat: number, lng: number): Promise<string> => {
    return new Promise((resolve) => {
      addToQueue(lat, lng, resolve);
    });
  };

  const handleCreate = (event: any) => {
    const layer = event.layer;
    if (layer instanceof L.Polyline) {
      const latlngs = layer.getLatLngs();

      // Comprobación de la estructura de los puntos
      const processLatLngs = (points: L.LatLng[]) => {
        points.forEach((latlng: L.LatLng) => {
          addToQueue(latlng.lat, latlng.lng, (street) => {
            if (street) {
              names.push(street)
              const uniqueStreetNames = [...new Set(names)];
              setNames(uniqueStreetNames)
            }
          });
        });
      };

      if (Array.isArray(latlngs[0])) {
        (latlngs as L.LatLng[][]).forEach((subLatLngs) => {
          processLatLngs(subLatLngs);
        });
      } else {
        processLatLngs(latlngs as L.LatLng[]);
      }
      handleCreatedLine();
    } else {
      handleCreateMarker()
    }
    ref.current?.addLayer(layer);
  };

  return (
    <FeatureGroup ref={ref}>
      <EditControl
        position='topright'
        onCreated={handleCreate}
        onEdited={handleCreateMarker}
        onDeleted={handleCreateMarker}
        draw={{
          polyline: !isProcessingQueue,
          polygon: false,
          circle: false,
          circlemarker: false,
          marker: !isProcessingQueue,
          rectangle: false,
        }}
      />
    </FeatureGroup>
  );
};

export default DrawMap;
