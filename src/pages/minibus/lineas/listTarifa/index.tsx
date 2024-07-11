import { Box, Card, CardContent, CardHeader, Dialog, DialogContent, Divider, Fade, FadeProps, FormControl, Grid, IconButton, List, ListItem, ListItemText, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Fragment, ReactElement, Ref, forwardRef, useEffect, useState } from "react";
import Icon from "src/@core/components/icon";
import AddDrawMap from "src/components/addDrawMap";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
// import { useService } from "src/hooks/useService";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/store";
import { asignedHorario, asignedTarifa, desasignedTarifa, fetchData } from "src/store/apps/linea";
import ListTarifa from "../../tarifas/list";
import { apiService } from "src/store/services/apiService";

interface Props {
  toggle: () => void;
  id: string;
}

interface TarifaData {
  name: string
  nro: number
}
interface TypeCell {
  row: TarifaData
}

const ViewTarifa = ({ toggle, id }: Props) => {

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
      headerName: 'Nombre de la tarifa',
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
      headerName: 'tarifas',
      width: 90,
      renderCell: ({ row }: TypeCell) => {
        return (
          <Fragment>
            <OpenInNewIcon sx={{ color: '#A0A0A0', cursor: 'pointer' }} onClick={()=>{previa(row)}} />
            <Typography noWrap variant="body2" sx={{ color: '#A0A0A0', cursor: 'pointer' }} onClick={()=>{previa(row)}}>
              ver tarifa
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
      headerName: 'Nombre de la tarifa',
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
      headerName: 'tarifas',
      width: 90,
      renderCell: ({ row }: TypeCell) => {
        return (
          <Fragment>
            <OpenInNewIcon sx={{ color: '#A0A0A0', cursor: 'pointer' }} onClick={()=>{previa(row)}} />
            <Typography noWrap variant="body2" sx={{ color: '#A0A0A0', cursor: 'pointer' }} onClick={()=>{previa(row)}}>
              ver tarifa
            </Typography>
          </Fragment>
        )
      }
    },
  ]

  const [pageSize, setPageSize] = useState<number>(10)
  const [pageSize2, setPageSize2] = useState<number>(10)
  const [tarifas, setTarifas] = useState<any[]>([])
  const [dataTarifa, setDataTarifa] = useState<[]>([])
  const [linea, setLinea] = useState<any>({id:''})
  const [openTrifa, setOpenTarifa] = useState(false)
  const [data,setdata] = useState<any>()
  // const { GetId } = useService()

  const dispatch = useDispatch<AppDispatch>()
  const toggleTarifa = () =>setOpenTarifa(!openTrifa)
  useEffect(() => {
    if (id) {
      const fetch = async () => {
        const lineaDB = await apiService.GetId('/linea/lineaOne', id)
        if(lineaDB.data){
          const response = await apiService.GetId('/linea/tarifa', lineaDB.data.id)
          const newdata = response.data.map((value: any, index: number) => ({
            ...value,
            nro: index + 1,
          }));
          setTarifas(newdata)
        }
        const newTarifa = lineaDB.data.rate.map((value: any, index: number) => ({
          ...value,
          nro: index + 1,
        }));
        setLinea(lineaDB.data)
        setDataTarifa(newTarifa)
      }
      fetch();
    }
  }, [id, toggle])
  const previa = (data:any) => {
    setdata(data)
    toggleTarifa()
  }
  const handleDesasigned = async (tarifadata:any) => {
    try {
      const response = await dispatch(desasignedTarifa({ data: { rate: [tarifadata._id] }, id: linea.id }))
      if (response.payload.success) {
        dispatch(fetchData())
        setDataTarifa(response.payload.data.rate)

        const res = await apiService.GetId('/linea/tarifa', linea.id)
        setTarifas(res.data)
      }
    } catch (error) { } finally {

    }
  }
  const handleAsigned = async (tarifas:any) => {
    try {
      const response = await dispatch(asignedTarifa({ data: { rate:[tarifas._id]  }, id: linea.id }))
      if (response.payload.success) {
        dispatch(fetchData())
        setDataTarifa(response.payload.data.rate)

        const res = await apiService.GetId('/linea/tarifa', linea.id)
        setTarifas(res.data)
      }
    } catch (error) { } finally {
    }
  }
  return (
    <AddDrawMap toggle={toggle} title={`Asignar o desasignar tarifas a la linea ${linea.name}`}>
      <Grid container spacing={1} >
        <Grid item xs={12} sm={6}>
          <CardContent>
            <Card>
              <CardHeader title='Tarifas asignadas ' sx={{ pb: 0, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
              <DataGrid
                autoHeight
                rows={dataTarifa}
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
              <CardHeader title='Tarifas no asignadas ' sx={{ pb: 0, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
              <DataGrid
                autoHeight
                rows={tarifas}
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
        <ListTarifa open={openTrifa} toggle={toggleTarifa} data={data} />
      </Grid>
    </AddDrawMap>
  );
};

export default ViewTarifa;
