import { Box, Card, CardContent, CardHeader, Grid, IconButton,Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Fragment,useEffect, useState } from "react";
import AddDrawMap from "src/components/addDrawMap";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
// import { useService } from "src/hooks/useService";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/store";
import { asignedHorario, desasignedHorario, fetchData } from "src/store/apps/linea";
import ListDays from "../../horario/days";
import { apiService } from "src/store/services/apiService";

interface Props {
  toggle: () => void;
  data: any;
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

const ViewHorario = ({ toggle, data }: Props) => {

  const columns = [
    {
      flex: 0.2,
      field: 'name',
      headerName: 'Nombre del horario',
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
      headerName: 'horario',
      width: 90,
      renderCell: ({ row }: TypeCell) => {
        return (
          <Fragment>
            <OpenInNewIcon sx={{ color: '#A0A0A0', cursor: 'pointer' }} onClick={()=>{previa(row)}} />
            <Typography noWrap variant="body2" sx={{ color: '#A0A0A0', cursor: 'pointer' }} onClick={()=>{previa(row)}}>
              ver horario
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
      field: 'name',
      headerName: 'Nombre del horario',
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
      headerName: 'horario',
      width: 90,
      renderCell: ({ row }: TypeCell) => {
        return (
          <Fragment>
            <OpenInNewIcon sx={{ color: '#A0A0A0', cursor: 'pointer' }} onClick={()=>{previa(row)}} />
            <Typography noWrap variant="body2" sx={{ color: '#A0A0A0', cursor: 'pointer' }} onClick={()=>{previa(row)}}>
              ver horario
            </Typography>
          </Fragment>
        )
      }
    },
  ]

  const [pageSize, setPageSize] = useState<number>(10)
  const [pageSize2, setPageSize2] = useState<number>(10)
  const [horarios, sethorarios] = useState<any[]>([])
  const [datahorario, setDatahorario] = useState<[]>([])
  const [linea, setLinea] = useState<any>({id:''})
  const [openDays, setOpenDays] = useState(false)
  const [horDta,setdata] = useState<any>()

  const dispatch = useDispatch<AppDispatch>()
  const toggleDays = () =>setOpenDays(!openDays)
  useEffect(() => {
    if (data) {
      const fetch = async () => {
        setDatahorario(data.horario)
        setLinea(data)
        const response = await apiService.GetId('/linea/horarios', data.id)
        sethorarios(response.data)
      }
      fetch();
    }
  }, [data])
  const previa = (data:any) => {
    setdata(data)
    toggleDays()
  }
  const handleDesasigned = async (horariodata:any) => {
    try {
      const response = await dispatch(desasignedHorario({ data: { horario: [horariodata._id] }, id: linea.id }))
      if (response.payload.success) {
        dispatch(fetchData())
        setDatahorario(response.payload.data.horario)

        const res = await apiService.GetId('/linea/horarios', linea.id)
        sethorarios(res.data)
      }
    } catch (error) { } finally {
    }
  }
  const handleAsigned = async (horario:any) => {
    try {
      const response = await dispatch(asignedHorario({ data: { horario:[horario._id]  }, id: linea.id }))
      if (response.payload.success) {
        dispatch(fetchData())
        const res = await apiService.GetId('/linea/horarios', linea.id)
        setDatahorario(response.payload.data.horario)
        sethorarios(res.data)
      }
    } catch (error) { } finally {
    }
  }
  return (
    <AddDrawMap toggle={toggle} title={`Asignar o desasignar horarios a la linea ${linea.name}`}>
      <Grid container spacing={1} >
        <Grid item xs={12} sm={6}>
          <CardContent>
            <Card>
              <CardHeader title='Horarios asignadas ' sx={{ pb: 0, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
              <DataGrid
                autoHeight
                rows={datahorario}
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
              <CardHeader title='Horarios no asignadas ' sx={{ pb: 0, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
              <DataGrid
                autoHeight
                rows={horarios}
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
        <ListDays open={openDays} toggle={toggleDays} data={horDta} />
      </Grid>
    </AddDrawMap>
  );
};

export default ViewHorario;
