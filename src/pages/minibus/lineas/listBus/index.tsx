import { Box, Button, Card, CardContent, CardHeader, Dialog, DialogContent, Divider, Fade, FadeProps, FormControl, Grid, IconButton, List, ListItem, ListItemText, MenuItem, TextField, Typography } from "@mui/material";
import { DataGrid, GridSelectionModel } from "@mui/x-data-grid";
import { ChangeEvent, Fragment, ReactElement, Ref, forwardRef, useEffect, useState } from "react";
import AddDrawMap from "src/components/addDrawMap";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
// import { useService } from "src/hooks/useService";
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/store";
import { asignedBus, asignedHorario, desasignedBus, desasignedHorario, fetchData } from "src/store/apps/linea";
import FilterListIcon from '@mui/icons-material/FilterList';
import CustomChip from 'src/@core/components/mui/chip'
import { isImage } from "src/utils/verificateImg";
import getConfig from 'src/configs/environment'
import CustomRenderCell from "../../bus/profile";
import { apiService } from "src/store/services/apiService";

interface Props {
  toggle: () => void;
  data: any;
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
interface BusMaker {
  name:string
}
interface BusType{
  name:string
}

interface BusStatus{
  name:string
}
type Bus = {
  id: string,
  trademark: BusMaker,
  model: number,
  type: BusType,
  plaque: string,
  cantidad: number,
  gps: string,
  photo: string,
  status: BusStatus,
  ruat:string
  userId:UsersType
}
interface TypeCell {
  row: Bus
}
const defaultFilter = {
  trademark: '',
  model: '',
  type: '',
  plaque: '',
  cantidad: '',
  status: '',
  userId: ''
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
const ViewBuses = ({ toggle, data }: Props) => {

  const columns = [
    {
      flex: 0.2,
      minWidth: 200,
      field: 'trademark',
      headerName: 'Marca',
      renderCell: ({ row }: TypeCell) => {
        return (
          <Box sx={{ display: 'flex' }}>
            {renderImg(row)}
            <Box sx={{ display: 'flex', paddingTop: 2, paddingLeft: 1 }}>
              <Typography noWrap variant='body2'>
                {row.trademark?.name}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 90,
      field: 'model',
      sortable: false,
      headerName: 'Modelo',
      renderCell: ({ row }: TypeCell) => {
        return (
          <Typography noWrap variant='body2'>
            {row.model}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 90,
      field: 'type',
      sortable: false,
      headerName: 'Tipo',
      renderCell: ({ row }: TypeCell) => {
        return (
          <Typography noWrap variant='body2'>
            {row.type?.name}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 90,
      field: 'plaque',
      sortable: false,
      headerName: 'Placa',
      renderCell: ({ row }: TypeCell) => {
        return (
          <Typography noWrap variant='body2'>
            {row.plaque}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 20,
      field: 'cantidad',
      headerName: 'Asientos',
      renderCell: ({ row }: TypeCell) => {
        return (
          <Typography noWrap variant='body2'>
            {row.cantidad}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 230,
      field: 'chofer',
      headerName: 'Chofer',
      renderCell: ({ row }: TypeCell) => <CustomRenderCell row={row} />
    },
    {
      flex: 0.2,
      minWidth: 130,
      field: 'status',
      variant: 'outlined',
      headerName: 'Estado',
      renderCell: ({ row }: TypeCell) => {
        return (
          <CustomChip
            skin='light'
            size='small'
            label={row.status?.name}
            color={row.status?.name === 'Activo' ? 'success' : row.status?.name === 'En mantenimiento' ? 'warning' : row.status?.name === 'Inactivo' ? 'secondary' : 'info'}
            sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
          />
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
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }} onClick={() => handleDesasigned(row)}>
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
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }} onClick={() => handleAsigned(row)}>
            <IconButton sx={{ backgroundColor: theme => theme.palette.primary.main, color: '#fff' }}>
              <ArrowBackIosNewIcon />
            </IconButton>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 200,
      field: 'trademark',
      headerName: 'Marca',
      renderCell: ({ row }: TypeCell) => {
        return (
          <Box sx={{ display: 'flex' }}>
            {renderImg(row)}
            <Box sx={{ display: 'flex', paddingTop: 2, paddingLeft: 1 }}>
              <Typography noWrap variant='body2'>
                {row.trademark?.name}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 90,
      field: 'model',
      sortable: false,
      headerName: 'Modelo',
      renderCell: ({ row }: TypeCell) => {
        return (
          <Typography noWrap variant='body2'>
            {row.model}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 90,
      field: 'type',
      sortable: false,
      headerName: 'Tipo',
      renderCell: ({ row }: TypeCell) => {
        return (
          <Typography noWrap variant='body2'>
            {row.type?.name}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 90,
      field: 'plaque',
      sortable: false,
      headerName: 'Placa',
      renderCell: ({ row }: TypeCell) => {
        return (
          <Typography noWrap variant='body2'>
            {row.plaque}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 20,
      field: 'cantidad',
      headerName: 'Asientos',
      renderCell: ({ row }: TypeCell) => {
        return (
          <Typography noWrap variant='body2'>
            {row.cantidad}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 230,
      field: 'chofer',
      headerName: 'Chofer',
      renderCell: ({ row }: TypeCell) => <CustomRenderCell row={row} />
    },
    {
      flex: 0.2,
      minWidth: 130,
      field: 'status',
      variant: 'outlined',
      headerName: 'Estado',
      renderCell: ({ row }: TypeCell) => {
        return (
          <CustomChip
            skin='light'
            size='small'
            label={row.status?.name}
            color={row.status?.name === 'Activo' ? 'success' : row.status?.name === 'En mantenimiento' ? 'warning' : row.status?.name === 'Inactivo' ? 'secondary' : 'info'}
            sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
          />
        )
      }
    }
  ]
  const [pageSizeAsigned, setPageSizeAsigned] = useState<number>(10)
  const [pageSizeDesasigned, setPageSizeDesasigned] = useState<number>(10)
  const [pageDesasigned, setPageDesasigned] = useState<number>(0)
  const [buses, setBuses] = useState<any[]>([])
  const [dataBus, setDataBus] = useState<any[]>([])
  const [linea, setLinea] = useState<any>({ id: '' })
  const [filtersAsigned, setFiltersAsigned] = useState(defaultFilter)
  const [filtersDesasigned, setFiltersDesasigned] = useState(defaultFilter)
  const [total, setTotal] = useState<number>(0)
  const [openfilters, setOpenFilters] = useState(false)
  const [openfilters2, setOpenFilters2] = useState(false)
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);
  const [selectionModel2, setSelectionModel2] = useState<GridSelectionModel>([]);

  const dispatch = useDispatch<AppDispatch>()

  const toggleFilter = () => setOpenFilters(!openfilters)
  const toggleFilter2 = () => setOpenFilters2(!openfilters2)
  useEffect(() => {
    if (data) {
      const fetch = async () => {
        const response = await apiService.Get('/linea/allBusNotAsigned', { filter: '', skip: pageDesasigned * pageSizeDesasigned, limit: pageSizeDesasigned })
        setBuses(response.data.result)
        setTotal(response.data.total)
        setLinea(data)
        setDataBus(data.buses)
      }
      fetch();
    }
  }, [data, pageDesasigned, pageSizeDesasigned])


  const handleDesasigned = async (busdata: any) => {
    try {
      const response = await dispatch(desasignedBus({ data: { buses: [busdata._id] }, id: linea.id }))
      if (response.payload.success) {
        dispatch(fetchData())
        setDataBus(response.payload.data.buses)

        const res = await apiService.Get('/linea/allBusNotAsigned', { filter: '', skip: 0, limit: 10 })
        setBuses(res.data.result)
        setTotal(res.data.total)
      }
    } catch (error) { } finally {

    }
  }
  const handleAsigned = async (bus: any) => {
    try {
      const response = await dispatch(asignedBus({ data: { buses: [bus._id] }, id: linea.id }))
      if (response.payload.success) {
        dispatch(fetchData())
        setDataBus(response.payload.data.buses)

        const res = await apiService.Get('/linea/allBusNotAsigned', { filter: '', skip: 0, limit: 10 })
        setBuses(res.data.result)
        setTotal(res.data.total)
      }
    } catch (error) { } finally {
    }
  }
  const handleChangeFieldsAsigned = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFiltersAsigned({
      ...filtersAsigned,
      [name]: value
    })
  }
  const handleFiltersAsigned = () => {
    const filteredBuses = dataBus.filter((bus: any) => {
      return (
        (filtersAsigned.trademark === '' || bus.trademark?.name.includes(filtersAsigned.trademark)) &&
        (filtersAsigned.model.toString() === '' || bus.model.toString().includes(filtersAsigned.model.toString())) &&
        (filtersAsigned.type === '' || bus.type?.name.includes(filtersAsigned.type)) &&
        (filtersAsigned.plaque === '' || bus.plaque.includes(filtersAsigned.plaque)) &&
        (filtersAsigned.cantidad.toString() === '' || bus.cantidad.toString().includes(filtersAsigned.cantidad.toString())) &&
        (filtersAsigned.status === '' || bus.status?.status.includes(filtersAsigned.status)) &&
        (filtersAsigned.userId === '' || bus.userId?.name.includes(filtersAsigned.userId))

      );
    });
    setDataBus(filteredBuses)
    // dispatch(fetchData({ filter: filters, skip: page * pageSize, limit: pageSize }))
  }
  const handleResetFiltersAsigned = async () => {
    setFiltersAsigned(defaultFilter)
    const lineaDB = await apiService.GetId('/linea/lineaOne', data.id)
    setDataBus(lineaDB.data.buses)
    // dispatch(fetchData({ filter: '', skip: page * pageSize, limit: pageSize }))
  }


  const handleFiltersDesasigned = async () => {
    const res = await apiService.Get('/linea/allBusNotAsigned', { filter: filtersDesasigned })
    setBuses(res.data.result)
    setTotal(res.data.total)
    // dispatch(fetchData({ filter: filters, skip: page * pageSize, limit: pageSize }))
  }
  const handleResetFiltersDesasigned = async () => {
    const res = await apiService.Get('/linea/allBusNotAsigned', { filter: '', skip: pageDesasigned * pageSizeDesasigned, limit: pageSizeDesasigned })
    setBuses(res.data.result)
    setTotal(res.data.total)
    setFiltersDesasigned(defaultFilter)
    // dispatch(fetchData({ filter: '', skip: page * pageSize, limit: pageSize }))
  }
  const handleChangeFieldsDesasigned = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFiltersDesasigned({
      ...filtersDesasigned,
      [name]: value
    })
  }
  const handleAsignedAll = async () => {
    try {
      const objetosFiltrados = buses.filter(objeto => selectionModel2.includes(objeto.id));
      const ids = objetosFiltrados.map((bus) => {
        return bus._id
      })
      const response = await dispatch(asignedBus({ data: { buses: ids }, id: linea.id }))
      if (response.payload.success) {
        dispatch(fetchData())
        setDataBus(response.payload.data.buses)

        const res = await apiService.Get('/linea/allBusNotAsigned', { filter: '', skip: 0, limit: 10 })
        setBuses(res.data.result)
        setTotal(res.data.total)
      }
    } catch (error) { } finally {
    }

  }
  const handleDesasignedAll = async () => {
    try {
      const objetosFiltrados = dataBus.filter(objeto => selectionModel.includes(objeto.id));
      const ids = objetosFiltrados.map((bus) => {
        return bus._id
      })
      const response = await dispatch(desasignedBus({ data: { buses: ids }, id: linea.id }))
      if (response.payload.success) {
        dispatch(fetchData())
        setDataBus(response.payload.data.buses)

        const res = await apiService.Get('/linea/allBusNotAsigned', { filter: '', skip: 0, limit: 10 })
        setBuses(res.data.result)
        setTotal(res.data.total)
      }
    } catch (error) { } finally {
    }
  }
  return (
    <AddDrawMap toggle={toggle} title={`Asignar o desasignar buses a la linea ${linea.name}`}>
      <Grid container spacing={1} >
        <Grid item xs={12}>
          <CardContent>
            <Card>
              <CardHeader title='Buses asignadas ' sx={{ pb: 0, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
              <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <Button variant="contained" sx={{ height: 43 }} onClick={toggleFilter}>
                  {openfilters ? 'Cerrar filtrado' : 'Filtrar por columnas'}
                </Button>
                <Button sx={{ mb: 2, mt: { xs: 3, sm: 0 } }} onClick={handleDesasignedAll} disabled={selectionModel.length === 0 ? true : false} variant='contained'>
                  desasignar en bloque
                </Button>
              </Box>
              {openfilters && <Box sx={{ pt: 0, pl: 5, pr: 5, pb: 3 }}>
                <Card sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={1.71}>
                      <FormControl fullWidth sx={{ mb: 1 }}>
                        <TextField label='Marca'
                          variant='standard'
                          name="trademark"
                          fullWidth
                          autoComplete='off'
                          value={filtersAsigned.trademark}
                          onChange={handleChangeFieldsAsigned}
                          InputProps={{
                            startAdornment: <FilterListIcon />,
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={1.71}>
                      <FormControl fullWidth sx={{ mb: 1 }}>
                        <TextField label='Modelo'
                          variant='standard'
                          name="model"
                          fullWidth
                          value={filtersAsigned.model}
                          onChange={handleChangeFieldsAsigned}
                          autoComplete='off'
                          InputProps={{
                            startAdornment: <FilterListIcon />,
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={1.71}>
                      <FormControl fullWidth sx={{ mb: 1 }}>
                        <TextField label='Tipo'
                          variant='standard'
                          fullWidth
                          name="type"
                          value={filtersAsigned.type}
                          onChange={handleChangeFieldsAsigned}
                          autoComplete='off'
                          InputProps={{
                            startAdornment: <FilterListIcon />,
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={1.71}>
                      <FormControl fullWidth sx={{ mb: 1 }}>
                        <TextField label='Placa'
                          variant='standard'
                          fullWidth
                          name="plaque"
                          value={filtersAsigned.plaque}
                          onChange={handleChangeFieldsAsigned}
                          autoComplete='off'
                          InputProps={{
                            startAdornment: <FilterListIcon />,
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={1.71}>
                      <FormControl fullWidth sx={{ mb: 1 }}>
                        <TextField label='Cantidad de Asientos'
                          variant='standard'
                          fullWidth
                          name="cantidad"
                          value={filtersAsigned.cantidad}
                          onChange={handleChangeFieldsAsigned}
                          autoComplete='off'
                          InputProps={{
                            startAdornment: <FilterListIcon />,
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={1.71}>
                      <FormControl fullWidth sx={{ mb: 1 }}>
                        <TextField label='Chofer'
                          variant='standard'
                          fullWidth
                          name="userId"
                          value={filtersAsigned.userId}
                          onChange={handleChangeFieldsAsigned}
                          autoComplete='off'
                          InputProps={{
                            startAdornment: <FilterListIcon />,
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={1.71}>
                      <FormControl fullWidth sx={{ mb: 1 }}>
                        <TextField label='Estado'
                          variant='standard'
                          fullWidth
                          name="status"
                          value={filtersAsigned.status}
                          onChange={handleChangeFieldsAsigned}
                          autoComplete='off'
                          InputProps={{
                            startAdornment: <FilterListIcon />,
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Box>
                        <Button variant="contained" sx={{ mr: 3 }} onClick={handleFiltersAsigned}>Filtrar</Button>
                        <Button variant="outlined" onClick={handleResetFiltersAsigned}>Restablecer</Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              </Box>}
              <DataGrid
                autoHeight
                checkboxSelection
                rows={dataBus}
                columns={columns}
                pageSize={pageSizeAsigned}
                disableSelectionOnClick
                rowsPerPageOptions={[10, 25, 50]}
                sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
                onPageSizeChange={(newPageSize: number) => setPageSizeAsigned(newPageSize)}
                selectionModel={selectionModel}
                onSelectionModelChange={(newSelectionModel) => setSelectionModel(newSelectionModel)}
              />
            </Card>
          </CardContent>
        </Grid>
        <Grid item xs={12}>
          <CardContent>
            <Card>
              <CardHeader title='Buses no asignadas ' sx={{ pb: 0, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
              <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <Button variant="contained" sx={{ height: 43 }} onClick={toggleFilter2}>
                  {openfilters2 ? 'Cerrar filtrado' : 'Filtrar por columnas'}
                </Button>
                <Button sx={{ mb: 2, mt: { xs: 3, sm: 0 } }} onClick={handleAsignedAll} disabled={selectionModel2.length === 0 ? true : false} variant='contained'>
                  asignar en bloque
                </Button>
              </Box>
              {openfilters2 && <Box sx={{ pt: 0, pl: 5, pr: 5, pb: 3 }}>
                <Card sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={1.71}>
                      <FormControl fullWidth sx={{ mb: 1 }}>
                        <TextField label='Marca'
                          variant='standard'
                          name="trademark"
                          fullWidth
                          autoComplete='off'
                          value={filtersDesasigned.trademark}
                          onChange={handleChangeFieldsDesasigned}
                          InputProps={{
                            startAdornment: <FilterListIcon />,
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={1.71}>
                      <FormControl fullWidth sx={{ mb: 1 }}>
                        <TextField label='Modelo'
                          variant='standard'
                          name="model"
                          fullWidth
                          value={filtersDesasigned.model}
                          onChange={handleChangeFieldsDesasigned}
                          autoComplete='off'
                          InputProps={{
                            startAdornment: <FilterListIcon />,
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={1.71}>
                      <FormControl fullWidth sx={{ mb: 1 }}>
                        <TextField label='Tipo'
                          variant='standard'
                          fullWidth
                          name="type"
                          value={filtersDesasigned.type}
                          onChange={handleChangeFieldsDesasigned}
                          autoComplete='off'
                          InputProps={{
                            startAdornment: <FilterListIcon />,
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={1.71}>
                      <FormControl fullWidth sx={{ mb: 1 }}>
                        <TextField label='Placa'
                          variant='standard'
                          fullWidth
                          name="plaque"
                          value={filtersDesasigned.plaque}
                          onChange={handleChangeFieldsDesasigned}
                          autoComplete='off'
                          InputProps={{
                            startAdornment: <FilterListIcon />,
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={1.71}>
                      <FormControl fullWidth sx={{ mb: 1 }}>
                        <TextField label='Cantidad de Asientos'
                          variant='standard'
                          fullWidth
                          name="cantidad"
                          value={filtersDesasigned.cantidad}
                          onChange={handleChangeFieldsDesasigned}
                          autoComplete='off'
                          InputProps={{
                            startAdornment: <FilterListIcon />,
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={1.71}>
                      <FormControl fullWidth sx={{ mb: 1 }}>
                        <TextField label='Chofer'
                          variant='standard'
                          fullWidth
                          name="userId"
                          value={filtersDesasigned.userId}
                          onChange={handleChangeFieldsDesasigned}
                          autoComplete='off'
                          InputProps={{
                            startAdornment: <FilterListIcon />,
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={1.71}>
                      <FormControl fullWidth sx={{ mb: 1 }}>
                        <TextField label='Estado'
                          variant='standard'
                          fullWidth
                          name="status"
                          value={filtersDesasigned.status}
                          onChange={handleChangeFieldsDesasigned}
                          autoComplete='off'
                          InputProps={{
                            startAdornment: <FilterListIcon />,
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Box>
                        <Button variant="contained" sx={{ mr: 3 }} onClick={handleFiltersDesasigned}>Filtrar</Button>
                        <Button variant="outlined" onClick={handleResetFiltersDesasigned}>Restablecer</Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              </Box>}
              <DataGrid
                autoHeight
                rows={buses}
                columns={columns2}
                pagination
                checkboxSelection
                pageSize={pageSizeDesasigned}
                disableSelectionOnClick
                onPageSizeChange={(newPageSize) => setPageSizeDesasigned(newPageSize)}
                rowsPerPageOptions={[10, 25, 50]}
                rowCount={total}
                paginationMode="server"
                onPageChange={(newPage) => setPageDesasigned(newPage)}
                sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
                selectionModel={selectionModel2}
                onSelectionModelChange={(newSelectionModel2) => setSelectionModel2(newSelectionModel2)}
              />
            </Card>
          </CardContent>
        </Grid>
      </Grid>
    </AddDrawMap>
  )
};

export default ViewBuses;
