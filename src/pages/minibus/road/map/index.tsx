import "leaflet/dist/leaflet.css"
import "leaflet-defaulticon-compatibility"
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"
import { MapContainer,TileLayer,GeoJSON} from "react-leaflet"
import { GeoJSONData } from "src/types/geoJSON"

interface PropsMap {
  geoJSON:GeoJSONData
  lat:number
  lng:number
  zoom:number
}
const Map = ({geoJSON,lat,lng,zoom}:PropsMap)=>{
  console.log('lat:',lat)
  console.log('lat:',lng)
  const styleMap = {
    width: '100%',
    height: '65vh'
  };
  return (
  <><MapContainer center={[lat, lng]} zoom={zoom} style={styleMap} >
    <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <GeoJSON data={geoJSON}/>
    </MapContainer>
    </>
    )
}
export default Map