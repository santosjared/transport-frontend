import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import { MapContainer, TileLayer, GeoJSON, useMapEvent, useMapEvents, useMap } from "react-leaflet";
import { ReactNode, memo, useEffect, useRef, useState } from "react";
import type { FeatureCollection } from 'geojson';
import { LatLngBounds, LatLng, Point } from "leaflet";
import { Map as LeafletMap } from 'leaflet';

interface PropsMap {
  geoJSON?: FeatureCollection;
  center: [number, number];
  zoom?:number
  setHandleChanges?:(arg:boolean) => void;
  setPosition?: (position: LatLng | null) => void;
  setZoom?: (zoom: number) => void;
  children?: ReactNode;
}

const Map = memo(({ geoJSON, center, children, setPosition, setZoom , zoom,setHandleChanges}: PropsMap) => {

  const mapRef = useRef<LeafletMap | null>(null);
  if (mapRef.current && setZoom) {
    mapRef.current.on('zoomend', () => {
      const zoom = mapRef.current!.getZoom();
      if (setZoom) {
        if(setHandleChanges){
          setHandleChanges(true) 
        }
        setZoom(zoom);
      }
    });
  }
  const handleMapClick = (e: any) => {
    if (setPosition) {
      const newPosition = new LatLng(e.latlng.lat, e.latlng.lng);
      if(setHandleChanges){
        setHandleChanges(true)
      }
      setPosition(newPosition);
    }
  };

  const handleMapDragEnd = (e: any) => {
    if (setPosition) {
      const mapBounds = e.target.getBounds();
      const center = mapBounds.getCenter();
      if(setHandleChanges){
        setHandleChanges(true)
      }
      setPosition(center);
    }
  };

  const styleMap = {
    width: '100%',
    height: '65vh'
  };

  return (
    <MapContainer center={center} zoom={zoom?zoom:16} style={styleMap} ref={mapRef}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {geoJSON && <GeoJSON data={geoJSON} />}
      {children}
      {setPosition && <CustomClickHandler onClick={handleMapClick} />}
      {setPosition && <CustomDragHandler onDragEnd={handleMapDragEnd} />}
    </MapContainer>
  );
});

interface CustomClickHandlerProps {
  onClick: (e: any) => void;
}

const CustomClickHandler = ({ onClick }: CustomClickHandlerProps) => {
  useMapEvent('click', onClick);
  return null;
};

interface CustomDragHandlerProps {
  onDragEnd: (e: any) => void;
}

const CustomDragHandler = ({ onDragEnd }: CustomDragHandlerProps) => {
  useMapEvent('dragend', onDragEnd);
  return null;
};

export default Map;
