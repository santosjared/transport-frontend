import { Autocomplete, Card, CardHeader, Grid, TextField } from '@mui/material';
import dynamic from 'next/dynamic';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { GeoJSONData } from 'src/types/geoJSON';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

interface Search {
  x:number
  y:number
  label:string
  inputValue?:string
}
type SearchData = Search[]
const geojsonData:GeoJSONData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        stroke:'#0000ff',
        strokeWidth:2,
        strokeOpacity:1,
        fill:'#ff0000',
        fillOpacity:0.5
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-67.01014716487808, -20.709537938468216],
          [-61.249975998390184, -14.294169425330992],
          [-70.249975998390184, -11.294169425330992],
          [-100.249975998390184, -5.294169425330992]
        ],
      },
    },
  ],
};
const Roads = ()=>{
  const Map = useMemo(() => dynamic(
    () => import('./map'),
    { 
      loading: () => <p>Cargando la Mapa</p>,
      ssr: false
    }
  ), [])
  const [options, setOptions] = useState<SearchData>([])
  const [lat,setLat] = useState<number>(0)
  const [lng,setLng] = useState<number>(0)
  const search = async (query: string) => {
    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query });
    setOptions(results);
  };

  const handleQuery = (e:ChangeEvent<HTMLInputElement>)=>{
    const query = e.target.value;
    search(query);
  }
  const handleSelect = (value:string | Search | null) =>{
    if(value && typeof value==='object'){
      setLat(value.x)
      setLng(value.y)
    }
  }
    return(
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
          <CardHeader title='Registro de rutas' sx={{pb:4, '& .MuiCardHeader-title':{letterSpacing:'.15px'}}}/>
          <Card>
          <Map 
          geoJSON={geojsonData}
          lat={lat}
          lng={lng}
          zoom={13}
          />
          <Autocomplete 
          
              options={options}
              getOptionLabel={(options) => {
                // Value selected with enter, right from the input
                if (typeof options === 'string') {
                  return options;
                }
                // Add "xxx" option created dynamically
                if (options.inputValue) {
                  return options.inputValue;
                }
                // Regular option
                return options.label;
              }}
              onChange={(event,value)=>handleSelect(value)}
              freeSolo
              renderInput={(params)=> (
                <TextField
                {...params}
                label='Buscar ubicación'
                onChange={handleQuery}
                InputProps={{
                  ...params.InputProps,
                  startAdornment:(
                    <>
                    {/* <SearchIcon /> */}
                    {params.InputProps.startAdornment}
                    </>
                  )
                }}
                />

              )}
              sx={{borderTopLeftRadius:0, borderTopRightRadius:0}}
              >

              </Autocomplete>
          </Card>
      </Card>
      </Grid>
      </Grid>
    )
}
export default Roads