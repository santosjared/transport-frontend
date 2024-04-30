import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet-realtime';
import io from 'socket.io-client';
import getConfig from 'src/configs/environment';
import type { FeatureCollection } from 'geojson';
import { useSocket } from "src/hooks/useSocket";
import { Avatar } from "@mui/material";

interface Props {
    center:[lat:number,lng:number]
}
const RealtimeMap = ({center}:Props) => {
    const mapRef = useRef(null);
    const [map, setMap] = useState<null | L.Map>(null);
    const [geojson, setGeojson] = useState<FeatureCollection | null>(null);
    const [data, setData] = useState()

    const {socket, isConnected, isLoading, isError} = useSocket()
    
    useEffect(()=>{
        if(isConnected){
          socket?.on('reSedLocation',(data)=>{
            setData(data)
          })
        }
      },[isConnected,socket])

    useEffect(() => {
        if (mapRef.current) {
            const newMap = L.map(mapRef.current!).setView(center, 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(newMap);
            setMap(newMap);
            return () => {
                if (newMap) {
                    newMap.remove();
                }
            };
        }
    }, []);

    useEffect(() => {
        if (map && geojson) {
            map.eachLayer((layer) => {
                if (!(layer instanceof L.TileLayer)) {
                    map.removeLayer(layer);
                }
            });
            L.geoJSON(geojson).addTo(map);
        }
    }, [geojson]);

    // const avatarIcon = L.divIcon({
    //     className: 'leaflet-div-icon',
    //     html: ReactDOMServer.renderToString(
    //         <Avatar src="/ruta/de/tu/imagen/avatar.png" alt="Avatar" />
    //     ),
    //     iconSize: [38, 38], // Tamaño del avatar
    //     iconAnchor: [22, 94], // Punto de anclaje del avatar
    //     popupAnchor: [-3, -76] // Punto de anclaje del popup
    // });
    // useEffect(() => {
    //     const socket = io(getConfig().backendURI);

    //     socket.on('reSedLocation', (data) => {

    //         setGeojson({
    //             type: 'FeatureCollection',
    //             features: [
    //                 {
    //                     type: 'Feature',
    //                     properties: {},
    //                     geometry: {
    //                         type: 'Point',
    //                         coordinates: [data.cordenates.lat,data.cordenates.lng],
    //                     },
    //                 },
    //             ],
    //         });
    //     });

    //     return () => {
    //         socket.disconnect();
    //     };
    // }, []);

    return <div ref={mapRef} style={{ height: '500px' }} />;
};

export default RealtimeMap;
