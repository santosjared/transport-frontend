import { FeatureGroup} from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import { CSSProperties, ChangeEvent,useEffect,useRef,useState } from 'react';
import { createStyles } from '@mui/material';
import type { FeatureCollection} from 'geojson';
import * as L from 'leaflet';
interface Props{
    geojson: FeatureCollection;
    setHandleChanges?:(arg:boolean) => void
    setGeojson: (geojson: FeatureCollection) => void;
}
const Colors:CSSProperties = createStyles({
    width:34,
    height:25,
    border:0,
    padding:0,
    left:'1%',
    zIndex:1001,  
    transform: 'translateY(320%)',
    position:'absolute',
    '&:hover':{
        cursor:'pointer',
    }
})

const DrawMap = ({geojson,setGeojson, setHandleChanges}:Props)=>{
    const ref = useRef<L.FeatureGroup>(null);
    const [polylineColor, setPolylineColor] = useState('#000');
    useEffect(() => {
        if (ref.current?.getLayers().length === 0 && geojson) {
          L.geoJSON(geojson).eachLayer((layer) => {
            if (
              layer instanceof L.Polyline ||
              layer instanceof L.Marker
            ) {
                ref.current?.addLayer(layer);   
            }
          });
        }
      }, [geojson]);
    const handleCreate = ()=>{
        const geo = ref.current?.toGeoJSON();
        if (geo?.type === 'FeatureCollection') {
            const updatedFeatures = geo.features.map((feature) => ({
                ...feature,
                properties: {
                  ...feature.properties,
                  stroke: polylineColor,
                  fill:polylineColor,
                },
              }));
              const updatedGeo = {
                ...geo,
                features: updatedFeatures,
              };
              if(setHandleChanges){
                setHandleChanges(true)
              }
              
            setGeojson(updatedGeo);
          }
    }
    const handleEdited = ()=>{
        handleCreate()
    }
    const handleDeleted = ()=>{
        handleCreate()
    }
    const handleColorChange = (event:ChangeEvent<HTMLInputElement>) => {
        setPolylineColor(event.target.value);
      };
    return(
    <><FeatureGroup ref={ref}>
        <EditControl
        position='topright'
        onCreated={handleCreate}
        onEdited={handleEdited}
        onDeleted={handleDeleted}
        draw={{
            // polyline:{
            //     shapeOptions:{
            //         color:polylineColor
            //     }
            // },
            polyline:true,
            polygon:false,
            circle:false,
            circlemarker:false,
            marker:true,
            rectangle:false,
        }}
        />
    </FeatureGroup>
    {/* <input type='color' style={Colors} onChange={handleColorChange}/> */}
    </>
    
    )
}
export default DrawMap
