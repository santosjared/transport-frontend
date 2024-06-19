import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { useSocket } from 'src/hooks/useSocket';
import getConfig from 'src/configs/environment';
import type { FeatureCollection } from 'geojson';
import { getThreeDigits } from 'src/@core/utils/get-initials'

interface Props {
    center: [number, number];
    id?:string | null
}

const RealtimeMap: React.FC<Props> = ({ center, id }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<L.Map | null>(null);
    const { socket, isConnected, connect } = useSocket();
    const [linea, setLinea] = useState<[]>([])
    const [geojsonR, setGeojsonR] = useState<FeatureCollection | null>(null)
    useEffect(()=>{
        socket?.on('updateLocations', (data) => {
            if(id){
                const newdata = data.filter((newLinea: { id: string; }) => newLinea.id === id);
                setLinea(newdata)
                setGeojsonR(newdata[0].road?newdata[0].road.geojson:null)
            }else{
                setLinea(data)
            }
        })
    },[socket, isConnected])
    useEffect(()=>{
        if(!isConnected){
            connect()
        }
        socket?.emit('newStatus')
    },[id])
    useEffect(() => {
        if (mapRef.current) {
            const newMap = L.map(mapRef.current).setView(center, 16);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(newMap);
            setMap(newMap);
            return () => {
                if (newMap) {
                    newMap.remove();
                }
            };
        }
    }, []);
    const avatarContainer = `
    display: flex;
    align-items: center;
    font-family: Arial, sans-serif;
    `
    const avatar = `
    width: 35px;
    height: 35px;
    border-radius: 50%;
    margin-right: 5px;
    `
    useEffect(() => {
            if (map && linea) {
                map.eachLayer((layer) => {
                    if (!(layer instanceof L.TileLayer)) {
                        map.removeLayer(layer);
                    }
                });
                linea.map((value: any) => {
                    const buses = value.buses
                    buses.map((bus: any) => {
                            if (bus.locationId && bus.userId) {
                               if(bus.locationId.cords.length>0) {const markerHtmlStyles = `
                                background-color: ${bus.locationId.speed == 0?'#e44b8d':
                                bus.locationId.speed >=1 && bus.locationId.speed<8?'#4040fb':
                                bus.locationId.speed >=8 && bus.locationId.speed <20? '#45a749':
                                bus.locationId.speed >=20 && bus.locationId.speed <=30? '#ff7c39':
                                '#ff4040'};
                                width: 1.75rem;
                                height: 1.75rem;
                                display: block;
                                left: -1rem;
                                top: -1.5rem;
                                position: relative;
                                border-radius: 2rem;
                                border: 1px solid #FFFFFF;`;
                                const icon = L.divIcon({
                                    className: "my-custom-pin",
                                    iconAnchor: [0, 24],
                                    popupAnchor: [0, -36],
                                    html: `<div style="${markerHtmlStyles}"><h3 style="position: relative;
                                    display: flex;
                                    top: -11px;
                                    left: 0px;
                                    color: #FFFFFF;
                                    text-align: center;
                                    justify-content: center;
                                    ">${value.name.length>3?getThreeDigits(value.name):value.name}</h3></div>`
                                });
                                L.marker(bus.locationId.cords, { icon: icon }).addTo(map).bindPopup(`<div style="${avatarContainer}">
                                <img style="${avatar}" src="${getConfig().backendURI}${bus.userId.profile}" alt="Avatar">
                                <div class="username">${bus.userId.name} ${bus.userId.lastName}</div></div>
                                <div>Licencia: ${bus.userId.licenceId?bus.userId.ci:''} ${bus.userId.licenceId?bus.userId.licenceId.category:'Ninguno'}</div>
                                <div>Placa: ${bus.plaque}</div>
                                <div>Velocidad:${bus.locationId.speed}km/h</div>
                                <div>Estado:
                                ${bus.locationId.speed == 0?'Parado':
                                  bus.locationId.speed >=1 && bus.locationId.speed<8?'Recorriendo lento':
                                  bus.locationId.speed >=8 && bus.locationId.speed <20? 'velocidad seguro':
                                  bus.locationId.speed >=20 && bus.locationId.speed <=30? 'Velocidad moderado':
                                  'Velocidad riesgoso'}
                                </div>
                                <div><img src="${getConfig().backendURI}${bus.photo}" alt="bus" style="width:40px;height:40px;"></div>`);}
                            }
                    })
                })
            }
    }, [linea]);
    useEffect(() => {
        if (map && geojsonR) {
            L.geoJSON(geojsonR).addTo(map)
        }
    }, [geojsonR, map])
    return <div ref={mapRef} style={{ height: '500px' }} />;
};

export default RealtimeMap;
