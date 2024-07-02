import { Box, Card, CardContent, CardHeader, Dialog, DialogContent, Divider, Fade, FadeProps, FormControl, Grid, IconButton, List, ListItem, ListItemText, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Fragment, ReactElement, Ref, forwardRef, useEffect, useState } from "react";
import Icon from "src/@core/components/icon";
import AddDrawMap from "src/components/addDrawMap";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useService } from "src/hooks/useService";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/store";
import { asignedRoad, desasignedRoad, fetchData } from "src/store/apps/linea";
import Swal from "sweetalert2";

interface Props {
  toggle: () => void;
  id: string;
  togglePrevia: () => void;
  SetSelectionRuta: (data: any) => void;
}

interface RoadData {
  createdAt: string
  name: string
  status: boolean
  id: string,
  nro: number
}
interface TypeCell {
  row: RoadData
}

const Rutas = ({ togglePrevia, toggle, id, SetSelectionRuta }: Props) => {

  const columns = [
    {
      flex: 0.2,
      field: 'Nro',
      width: 20,
      headerName: 'Nro',
      renderCell: ({ row }: TypeCell) => {
        return (
          <Typography noWrap variant="body2">
            {row.nro}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      field: 'name',
      headerName: 'Nombre de la ruta',
      width: 250,
      renderCell: ({ row }: TypeCell) => {
        return (
          <Typography noWrap variant="body2">
            {row.name}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      field: 'previa',
      headerName: 'previa',
      width: 90,
      renderCell: ({ row }: TypeCell) => {
        return (
          <Fragment>
            <OpenInNewIcon sx={{ color: '#A0A0A0', cursor: 'pointer' }} onClick={() => previa(row)} />
            <Typography noWrap variant="body2" sx={{ color: '#A0A0A0', cursor: 'pointer' }} onClick={() => previa(row)}>
              previa
            </Typography>
          </Fragment>
        )
      }
    },
    {
      flex: 0.2,
      field: 'desasignar',
      headerName: 'Desasignar',
      width: 40,
      renderCell: ({ row }: TypeCell) => {
        return (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }} onClick={()=>handleDesasigned(row)}>
            <IconButton sx={{ backgroundColor: theme => theme.palette.primary.main, color: '#fff' }}>
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        )
      }
    },
  ]

  const columns2 = [
    {
      flex: 0.2,
      field: 'asignar',
      headerName: 'asignar',
      width: 40,
      renderCell: ({ row }: TypeCell) => {
        return (
          <IconButton sx={{ backgroundColor: theme => theme.palette.primary.main, color: '#fff' }} onClick={()=>handleAsigned(row)}>
            <ArrowBackIosNewIcon />
          </IconButton>
        )
      }
    },
    {
      flex: 0.2,
      field: 'Nro',
      width: 20,
      headerName: 'Nro',
      renderCell: ({ row }: TypeCell) => {
        return (
          <Typography noWrap variant="body2">
            {row.nro}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      field: 'name',
      headerName: 'Nombre de la ruta',
      width: 250,
      renderCell: ({ row }: TypeCell) => {
        return (
          <Typography noWrap variant="body2">
            {row.name}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      field: 'previa',
      headerName: 'previa',
      width: 90,
      renderCell: ({ row }: TypeCell) => {
        return (
          <Fragment>
            <OpenInNewIcon sx={{ color: '#A0A0A0', cursor: 'pointer' }} onClick={() => previa(row)} />
            <Typography noWrap variant="body2" sx={{ color: '#A0A0A0', cursor: 'pointer' }} onClick={() => previa(row)}>
              previa
            </Typography>
          </Fragment>
        )
      }
    },
  ]

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10)
  const [pageSize2, setPageSize2] = useState<number>(10)
  const [roads, setRoads] = useState<any[]>([])
  const [dataRoad, setDataRoad] = useState<[]>([])
  const [linea, setLinea] = useState<any>({id:''})
  const { GetId } = useService()

  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    if (id) {
      const fetch = async () => {
        const lineaDB = await GetId('/linea/lineaOne', id)
        if(lineaDB.data){
          const response = await GetId('/linea/roads', lineaDB.data.id)
          const newdata = response.data.map((value: any, index: number) => ({
            ...value,
            nro: index + 1,
          }));
          setRoads(newdata)
        }
        const newRoad = lineaDB.data.road.map((value: any, index: number) => ({
          ...value,
          nro: index + 1,
        }));
        setLinea(lineaDB.data)
        setDataRoad(newRoad)
      }
      fetch();
    }
  }, [id, toggle])
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  const previa = (data: any) => {
    SetSelectionRuta(data)
    toggle()
    togglePrevia()
  }
  const handleDesasigned = async (roaddata:any) => {
    try {
      const busroad = await GetId('/bus/busroad', roaddata._id)
      if(!busroad.data){
        const response = await dispatch(desasignedRoad({ data: { road: [roaddata._id] }, id: linea.id }))
        if (response.payload.success) {
          dispatch(fetchData())
          setDataRoad(response.payload.data.road)

          const res = await GetId('/linea/roads', linea.id)
          setRoads(res.data)
        }
      }
      else{
        Swal.fire({title:'error!', text:'Primero desasigne la ruta del microbus', icon:'warning'})
      }

    } catch (error) { } finally {

    }
  }
  const handleAsigned = async (road:any) => {
    try {
      const response = await dispatch(asignedRoad({ data: { road:[road._id]  }, id: linea.id }))
      if (response.payload.success) {
        dispatch(fetchData())
        setDataRoad(response.payload.data.road)

        const res = await GetId('/linea/roads', linea.id)
        setRoads(res.data)
      }
    } catch (error) { } finally {
    }
  }
  return (
    <AddDrawMap toggle={toggle} title={`Asignar o desasignar rutas a la linea ${linea.name}`}>
      <Grid container spacing={1} >
        <Grid item xs={12} sm={6}>
          <CardContent>
            <Card>
              <CardHeader title='Rutas asignadas ' sx={{ pb: 0, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
              <DataGrid
                autoHeight
                rows={dataRoad}
                columns={columns}
                pageSize={pageSize}
                disableSelectionOnClick
                rowsPerPageOptions={[10, 25, 50]}
                sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
                onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
              />
            </Card>
          </CardContent>
        </Grid>
        <Grid item xs={12} sm={6}>
          <CardContent>
            <Card>
              <CardHeader title='Rutas no asignadas ' sx={{ pb: 0, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
              <DataGrid
                autoHeight
                rows={roads}
                columns={columns2}
                pageSize={pageSize2}
                disableSelectionOnClick
                rowsPerPageOptions={[10, 25, 50]}
                sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
                onPageSizeChange={(newPageSize: number) => setPageSize2(newPageSize)}
              />
            </Card>
          </CardContent>
        </Grid>
      </Grid>
    </AddDrawMap>
  );
};

export default Rutas;
