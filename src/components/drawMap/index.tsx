import { FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { useEffect, useRef } from 'react';
import type { FeatureCollection } from 'geojson';
import * as L from 'leaflet';
import axios from 'axios';

interface Props {
  geojson: FeatureCollection;
  setHandleChanges?: (arg: boolean) => void;
  setGeojson: (geojson: FeatureCollection) => void;
  isProcessingQueue: boolean;
  names: string[];
  setNames: (names: string[]) => void;
}

const DrawMap = ({ geojson, setGeojson, setHandleChanges, isProcessingQueue, names, setNames }: Props) => {
  const ref = useRef<L.FeatureGroup>(null);

  useEffect(() => {
    if (ref.current?.getLayers().length === 0 && geojson) {
      L.geoJSON(geojson).eachLayer((layer) => {
        if (layer instanceof L.Polyline || layer instanceof L.Marker) {
          ref.current?.addLayer(layer);
        }
      });
    }
  }, [geojson]);

  const getStreetName = async (lat: number, lng: number): Promise<string | null> => {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: {
          format: 'jsonv2',
          lat: lat,
          lon: lng,
        },
      });
      return response.data.address.road || null;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const updateFeatureWithStreetNames = async (feature: any) => {
    if (feature.geometry.type === 'LineString') {
      const coordinates = feature.geometry.coordinates as [number, number][];
      const streetNames = await Promise.all(
        coordinates.map(async ([lng, lat]) => {
          const streetName = await getStreetName(lat, lng);
          return streetName;
        })
      );

      feature.properties.street = streetNames;
    }
    return feature;
  };

  const handleCreatedLine = async () => {
    const geo = ref.current?.toGeoJSON();
    if (geo?.type === 'FeatureCollection') {
      const updatedFeatures = geo.features.map((feature) => {
        updateFeatureWithStreetNames(feature);
        return feature;
      });

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
  };

  const handleCreate = (event: any) => {
    const layer = event.layer;
    if (layer instanceof L.Polyline) {
      const latlngs = layer.getLatLngs();

      const processLatLngs = (points: L.LatLng[]) => {
        points.forEach(async (latlng: L.LatLng) => {
          const street = await getStreetName(latlng.lat, latlng.lng);
          if (street) {
            const newNames = [...names];
            newNames.push(street);
            const uniqueStreetNames = [...new Set(newNames)];
            setNames(uniqueStreetNames);
        }
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
      handleCreateMarker();
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
