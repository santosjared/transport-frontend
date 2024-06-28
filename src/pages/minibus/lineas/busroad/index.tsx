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
import { asignedBus, asignedRoad, desasignedBus, desasignedRoad, fetchData } from "src/store/apps/linea";
import { isImage } from "src/utils/verificateImg";
import getConfig from 'src/configs/environment'
import CustomRenderCell from "../../bus/profile";

interface Props {
  toggle: () => void;
  data:any
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
interface UsersType {
  name: string;
  lastName: string;
  ci: string;
  address: string;
  phone: string;
  gender: string;
  contry: string;
  email: string
  profile: string;
  rol: [];
}
type Bus = {
  id: string,
  trademark: string,
  model: number,
  type: string,
  plaque: string,
  cantidad: number,
  gps: string,
  photo: string,
  status: string,
  ruat:string
  userId:UsersType
}
interface TypeCellBus {
  row:Bus
}
const renderImg = (row: Bus) => {

  const [isImg, setIsImg] = useState<any>(false)
  useEffect(() => {
    const image = async () => {
      const img = await isImage(`${getConfig().backendURI}${row.photo}`)
      setIsImg(img)
    }
    image()
  }, [row.photo])
  if (isImg) {
    return (
      <Box sx={{ display: 'flex', border: 'solid 1px #E0E0E0', borderRadius: 0.5 }}>
      <img src={`${getConfig().backendURI}${row.photo}`} height={35} width={35} style={{ borderRadius: 5 }}></img>
    </Box>
    )
  } else {
    return ''
  }
}
const BusRoad = ({ togglePrevia, toggle, data, SetSelectionRuta }: Props) => {
  const columns = [
    {
      flex: 0.2,
      field: 'name',
      headerName: 'Nombre de la ruta',
      width: 250,
      renderCell: ({ row }: TypeCell) => {
        return (
          <Typography noWrap variant="body2" sx={{cursor:'pointer'}} onClick={()=>handleChangeRoad(row)}>
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
      const columnsBus = [
        {
          flex: 0.2,
          minWidth: 110,
          field: 'trademark',
          headerName: 'Marca',
          renderCell: ({ row }: TypeCellBus) => {
            return (
              <Box sx={{ display: 'flex' }}>
                {renderImg(row)}
                <Box sx={{ display: 'flex', paddingTop: 2, paddingLeft: 1 }}>
                  <Typography noWrap variant='body2'>
                    {row.trademark}
                  </Typography>
                </Box>
              </Box>
            )
          }
        },
        {
          flex: 0.2,
          minWidth: 90,
          field: 'plaque',
          sortable: false,
          headerName: 'Placa',
          renderCell: ({ row }: TypeCellBus) => {
            return (
              <Typography noWrap variant='body2'>
                {row.plaque}
              </Typography>
            )
          }
        },
        {
          flex: 0.2,
          minWidth: 110,
          field: 'chofer',
          headerName: 'Chofer',
          renderCell: ({ row }: TypeCellBus) => <CustomRenderCell row={row}/>
        },
        {
          flex: 0.2,
          field: 'desasignar',
          headerName: 'Desasignar',
          width: 40,
          renderCell: ({ row }: TypeCellBus) => {
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

  const columnsBus2 = [
    {
      flex: 0.2,
      field: 'asignar',
      headerName: 'asignar',
      width: 10,
      renderCell: ({ row }: TypeCellBus) => {
        return (
          <IconButton sx={{ backgroundColor: theme => theme.palette.primary.main, color: '#fff' }} onClick={()=>handleAsigned(row)}>
            <ArrowBackIosNewIcon />
          </IconButton>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 110,
      field: 'trademark',
      headerName: 'Marca',
      renderCell: ({ row }: TypeCellBus) => {
        return (
          <Box sx={{ display: 'flex' }}>
            {renderImg(row)}
            <Box sx={{ display: 'flex', paddingTop: 2, paddingLeft: 1 }}>
              <Typography noWrap variant='body2'>
                {row.trademark}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 90,
      field: 'plaque',
      sortable: false,
      headerName: 'Placa',
      renderCell: ({ row }: TypeCellBus) => {
        return (
          <Typography noWrap variant='body2'>
            {row.plaque}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 110,
      field: 'chofer',
      headerName: 'Chofer',
      renderCell: ({ row }: TypeCellBus) => <CustomRenderCell row={row}/>
    }
  ]

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10)
  const [road, setRoad] = useState<any>()
  const [linea, setLinea] = useState<any>({id:''})

  const { GetId, Update } = useService()
  const [busAsigned, setBuseAsigned] = useState<any[]>([])
  const [BusDesasigned,setBusDesasigned] = useState<any[]>([])
  useEffect(()=>{
    if(data.road.length !==0){
    setLinea(data)
    const filterAsigned = data.buses.filter((bus:any) => bus.road === data.road[0]._id);
    const filterNotAsigned = data.buses.filter((bus:any) => bus.road === null);
    setRoad(data.road[0])
    setBuseAsigned(filterAsigned)
    setBusDesasigned(filterNotAsigned)
    }
  },[data])
  const dispatch = useDispatch<AppDispatch>()
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  const previa = (data: any) => {
    SetSelectionRuta(data)
    toggle()
    togglePrevia()
  }
  const handleDesasigned = async (data:any) => {
    try {
        const res = await Update('/linea/desasignedBusRuta',{road:road._id, busId:data.id}, linea.id)
        const filterAsigned = res.data.buses.filter((bus:any) => bus.road === road._id);
        const filterNotAsigned = res.data.buses.filter((bus:any) => bus.road === null);
        setBuseAsigned(filterAsigned)
        setBusDesasigned(filterNotAsigned)
        setLinea(res.data)
        dispatch(fetchData())
    } catch (error) { } finally {

    }
  }
  const handleAsigned = async (data:any) => {
    try {
      const res = await Update('/linea/asignedBusRuta',{road:road._id, busId:data.id}, linea.id)
      const filterAsigned = res.data.buses.filter((bus:any) => bus.road === road._id);
      const filterNotAsigned = res.data.buses.filter((bus:any) => bus.road === null);
      setBuseAsigned(filterAsigned)
      setBusDesasigned(filterNotAsigned)
      setLinea(res.data)
      dispatch(fetchData())
  } catch (error) { } finally {

  }
  }
  const handleChangeRoad = (road:any) =>{
    const filterAsigned = linea.buses.filter((bus:any) => bus.road === road._id);
      setBuseAsigned(filterAsigned)
      setRoad(road)
   }
  return (
    <AddDrawMap toggle={toggle} title={`Asignar o desasignar rutas a buses de la linea ${linea.name}`}>
      <Grid container spacing={2} sx={{pb:4, pl:2,pr:2}} >
        <Grid item xs={12} sm={3}>
          <CardHeader title='Lista de rutas'/>
            <Card>
              <DataGrid
                autoHeight
                rows={data.road}
                columns={columns}
                pageSize={pageSize}
                disableSelectionOnClick
                rowsPerPageOptions={[10]}
                sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
                onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
              />
            </Card>

        </Grid>
        <Grid item xs={12} sm={4.5}>
          <CardHeader title='Lista buses con rutas '/>
            <Card>
              <DataGrid
                autoHeight
                rows={busAsigned}
                columns={columnsBus}
                pageSize={pageSize}
                disableSelectionOnClick
                rowsPerPageOptions={[10]}
                sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
                onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
              />
            </Card>
        </Grid>
        <Grid item xs={12} sm={4.5}>
          <CardHeader title='Lista buses sin rutas'/>
            <Card>
              <DataGrid
                autoHeight
                rows={BusDesasigned}
                columns={columnsBus2}
                pageSize={pageSize}
                disableSelectionOnClick
                rowsPerPageOptions={[10]}
                sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
                onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
              />
            </Card>
        </Grid>
      </Grid>
    </AddDrawMap>
  );
};

export default BusRoad;
