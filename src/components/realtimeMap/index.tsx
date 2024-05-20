import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { useSocket } from 'src/hooks/useSocket';
import { useService } from 'src/hooks/useService';
import getConfig from 'src/configs/environment';
import type { FeatureCollection } from 'geojson';
import { getThreeDigits } from 'src/@core/utils/get-initials'

interface Props {
    center: [number, number];
    linea: any[]
}

const RealtimeMap: React.FC<Props> = ({ center, linea }) => {

    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<L.Map | null>(null);
    const { socket, isConnected } = useSocket();
    const [data, setData] = useState<[]>([])
    const [allData, setAllData] = useState<any[]>([])
    const [geojson, setGeojson] = useState<FeatureCollection | null>(null)
    const { GetId } = useService()

    useEffect(() => {
        if (linea.length === 1) {
            const data = linea[0]
            const road = async () => {
                const response = await GetId('/road', data.route)
                setGeojson(response.data.geojsonR)
            }
            road()
        }
    }, [linea])
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
        socket?.on('locations', () => {
            if (map) {
                map.eachLayer((layer) => {
                    if (!(layer instanceof L.TileLayer)) {
                        map.removeLayer(layer);
                    }
                });
                linea.map((value: any) => {
                    const buses = value.buses
                    buses.map(async (busId: any) => {
                        const bus = await GetId('/bus', busId)
                        if (bus) {
                            const user = await GetId('/users', bus.data.idUser)
                            const chofer = await GetId('/choferes/user', bus.data.idUser)
                            const locations = await GetId('/locations', bus.data.idUser)
                            const statusConnect = await GetId('/status-connect', bus.data.idUser)
                            if (locations.data) {
                                const markerHtmlStyles = `
                                background-color: #e44b8d;
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
                                L.marker(locations.data.cords, { icon: icon }).addTo(map).bindPopup(`<div style="${avatarContainer}">
                                <img style="${avatar}" src="${getConfig().backendURI}${user.data.profile}" alt="Avatar">
                                <div class="username">${user.data.name} ${user.data.lastName}</div></div>
                                <div>Licencia: ${user.data.ci} ${chofer.data.category}</div>
                                <div>Placa: ${bus.data.plaque}</div>
                                <div>Velocidad:${locations.data.speed}km/h</div>
                                <div><img src="${getConfig().backendURI}${bus.data.photo}" alt="bus" style="width:40px;height:40px;"></div>`);
                            }
                        }
                    })
                })
            }
        })
    }, [socket, isConnected]);
    useEffect(() => {
        if (map && geojson) {
            L.geoJSON(geojson).addTo(map)
        }
    }, [geojson, map])
    return <div ref={mapRef} style={{ height: '500px' }} />;
};

export default RealtimeMap;
