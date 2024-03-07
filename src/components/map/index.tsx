import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import { MapContainer,TileLayer,GeoJSON} from "react-leaflet"
import { ReactNode } from "react"
import type { FeatureCollection } from 'geojson';

interface PropsMap {
  geoJSON?:FeatureCollection
  center:[lat:number,lng:number]
  zoom:number
  children?: ReactNode;
}
const Map = ({geoJSON,center,zoom,children}:PropsMap)=>{
  const styleMap = {
    width: '100%',
    height: '65vh'
  };
  return (
  <><MapContainer center={center} zoom={zoom} style={styleMap} >
    <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {geoJSON && (<GeoJSON data={geoJSON}/>)}
    {children}
    </MapContainer>
    </>
    )
}
export default Map