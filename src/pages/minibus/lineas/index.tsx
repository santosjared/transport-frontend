import { Box, Button, Card, CardHeader, FormControl, Grid, IconButton, Menu, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { useCallback, useEffect, useState, MouseEvent, ChangeEvent } from "react"
import { useQuery } from "react-query"
import AddDraw from "src/components/addDraw"
import TableHeader from "src/components/tableHeader"
import { useService } from "src/hooks/useService"
import AddLinea from "./register"
import { useDispatch } from "react-redux"
import { AppDispatch, RootState } from "src/store"
import { useSelector } from "react-redux"
import { deleteLinea, fetchData } from "src/store/apps/linea"
import ViewMap from "./ruta"
import ListRoad from "./listRoad"
import ViewHorario from "./ListHorario"
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ViewTarifa from "./listTarifa"
import ViewBus from "./listBus"
import Icon from "src/@core/components/icon"
import Swal from "sweetalert2"
import EditLinea from "./edit"
import FilterListIcon from '@mui/icons-material/FilterList';
import Rutas from "./rutas"
import BusRoad from "./busroad"

interface LineaData {
  id: string;
  name: string;
  road: [];
  horario: [];
  rate: [];
  buses: [];
  status: boolean;
}

const defaultFilter = {
  name: '',
  road: '',
  horario: '',
  rate: '',
  buses: '',
  status: ''
}

interface TypeCell {
  row: LineaData
}

const Lineas = () => {
  const RowOptions = ({ id, linea }: { id: string, linea?: any }) => {
    const dispatch = useDispatch<AppDispatch>()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const rowOptionsOpen = Boolean(anchorEl)

    const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget)
    }
    const handleRowOptionsClose = () => {
      setAnchorEl(null)
    }
    const handleDelete = async () => {
      handleRowOptionsClose()
      const confirme = await Swal.fire({
        title: '¿Estas seguro de eliminar?',
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#3085d6",
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#ff4040',
        confirmButtonText: 'Eliminar',
      }).then(async (result) => { return await result.isConfirmed });
      if (confirme) {
        dispatch(deleteLinea(id)).then((result) => {
          if (result.payload) {
            Swal.fire({
              title: '¡Éxito!',
              text: 'Los datos fueron eliminados',
              icon: "success"
            });
          }
        })
      }
    }

    return (
      <>
        <IconButton size='small' onClick={handleRowOptionsClick}>
          <Icon icon='mdi:dots-vertical' />
        </IconButton>
        <Menu
          keepMounted
          anchorEl={anchorEl}
          open={rowOptionsOpen}
          onClose={handleRowOptionsClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          PaperProps={{ style: { minWidth: '8rem' } }}
        >
          <MenuItem onClick={() => { handleRowOptionsClose(); handleEdit(linea) }} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='mdi:pencil-outline' fontSize={20} color='#00a0f4' />
            Editar
          </MenuItem>
          <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={handleDelete}>
            <Icon icon='ic:outline-delete' fontSize={20} color='#ff4040' />
            Eliminar
          </MenuItem>
        </Menu>
      </>
    )
  }
  const columns = [
    {
      flex: 0.2,
      field: 'name',
      headerName: 'Nombre de la linea',
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
      field: 'route',
      headerName: 'Rutas y paradas',
      renderCell: ({ row }: TypeCell) => {
        return (
          <>
            <OpenInNewIcon sx={{ color: '#A0A0A0', cursor: 'pointer' }} onClick={() => viewRoad(row)} />
            <Typography noWrap variant="body2" onClick={() => viewRoad(row)} sx={{ cursor: 'pointer' }}> ver rutas</Typography>
          </>
        )
      }
    },
    {
      flex: 0.2,
      field: 'horario',
      headerName: 'Horarios',
      renderCell: ({ row }: TypeCell) => {
        return (
          <>
            <OpenInNewIcon sx={{ color: '#A0A0A0', cursor: 'pointer' }} onClick={() => handleHorario(row)} />
            <Typography noWrap variant="body2" onClick={() => handleHorario(row)} sx={{ cursor: 'pointer' }}> ver horario</Typography>
          </>
        )
      }
    },
    {
      flex: 0.2,
      field: 'tarifa',
      headerName: 'Tarifas',
      renderCell: ({ row }: TypeCell) => {
        return (
          <>
            <OpenInNewIcon sx={{ color: '#A0A0A0', cursor: 'pointer' }} onClick={() => handleTarifa(row)} />
            <Typography noWrap variant="body2" sx={{ cursor: 'pointer' }} onClick={() => handleTarifa(row)}> ver tarifas</Typography>
          </>
        )
      }
    },
    {
      flex: 0.2,
      field: 'buses',
      headerName: 'Buses',
      renderCell: ({ row }: TypeCell) => {
        return (
          <>
            <OpenInNewIcon sx={{ color: '#A0A0A0', cursor: 'pointer' }} onClick={() => handleBus(row)} />
            <Typography noWrap variant="body2" sx={{ cursor: 'pointer' }} onClick={() => handleBus(row)}> ver buses</Typography>
          </>
        )
      }
    },
    {
      flex: 0.2,
      field: 'asgined',
      headerName: 'rutas buses',
      renderCell: ({ row }: TypeCell) => {
        return (
          <>
            <OpenInNewIcon sx={{ color: '#A0A0A0', cursor: 'pointer' }} onClick={() => handleBusRoad(row)} />
            <Typography noWrap variant="body2" sx={{ cursor: 'pointer' }} onClick={() => handleBusRoad(row)}> asignar o desasignar</Typography>
          </>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 80,
      field: 'actions',
      sortable: false,
      headerName: 'Acciones',
      renderCell: ({ row }: TypeCell) => {
        return (<RowOptions id={row.id} linea={row} />)
      }
    }
  ]

  const [pageSize, setPageSize] = useState<number>(10)
  const [openAdd, setOpenAdd] = useState<boolean>(false)
  const [openRoad, setOpenRoad] = useState(false)
  const [idLinea, setIdLinea] = useState('')
  const [openListRoad, setOpenListRoad] = useState(false)
  const [lineaData, setLinea] = useState<any[]>([])
  const [dataHorario, setDataHorario] = useState<any[]>([])
  const [openHorario, setOpenHorario] = useState(false)
  const [dataTarifa, setDataTarifa] = useState<any[]>([])
  const [openTarifa, setOpenTarifa] = useState(false)
  const [openBus, setOpenBus] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [page, setPage] = useState(0);
  const [openfilters, setOpenFilters] = useState(false)
  const [filters, setFilters] = useState(defaultFilter)
  const [openRuta, setOpenRuta] = useState(false)
  const [selectionRuta, setSelectionRuta] = useState<any[]>([])
  const [openBusRoad, setOpenBusRoad] = useState(false)
  const [openPrevia,setOpenPrevia] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.linea)

  const toggleRoad = () => setOpenRoad(!openRoad)
  const toggleDrawer = () => setOpenAdd(!openAdd)
  const toggleListRoad = () => setOpenListRoad(!openListRoad)
  const toggleHorario = () => setOpenHorario(!openHorario)
  const toggleTarifa = () => setOpenTarifa(!openTarifa)
  const toggleBus = () => setOpenBus(!openBus)
  const toggleEdit = () => setOpenEdit(!openEdit)
  const toggleFilter = () => setOpenFilters(!openfilters)
  const toggleRuta = () => setOpenRuta(!openRuta)
  const toggleBusRuta = () => setOpenBusRoad(!openBusRoad)
  const togglePrevia = () => setOpenPrevia(!openPrevia)

  useEffect(() => {
    dispatch(fetchData({ filter: '', skip: page * pageSize, limit: pageSize }))
  }, [page, pageSize])
  const handleEdit = (linea: any) => {
    setLinea(linea)
    toggleEdit()
  }
  const viewRoad = (data: any) => {
    setIdLinea(data.id)
    toggleRuta()
  }
  const handleHorario = (data: any) => {
    setIdLinea(data.id)
    toggleHorario()
  }
  const handleTarifa = (data: any) => {
    setIdLinea(data.id)
    toggleTarifa()
  }
  const handleBus = (data: any) => {
    setIdLinea(data.id)
    toggleBus()
  }
  const handleChangeFields = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters({
      ...filters,
      [name]: value
    })
  }
  const handleFilters = () => {
    dispatch(fetchData({ filter: filters, skip: page * pageSize, limit: pageSize }))
  }
  const handleReset = () => {
    setFilters(defaultFilter)
    dispatch(fetchData({ filter: '', skip: page * pageSize, limit: pageSize }))
  }
  const handleBusRoad =(data:any) =>{
    setLinea(data)
    toggleBusRuta()
  }
  if (openRoad) {
    return (
      <ViewMap data={selectionRuta} onClose={toggleRoad} toggleRutas={toggleRuta} />
    )
  }
  if (openRuta) {
    return (
      <Rutas togglePrevia={toggleRoad} toggle={toggleRuta} id={idLinea} SetSelectionRuta={setSelectionRuta} />
    )
  }
  if (openHorario) {
    return (
      <ViewHorario toggle={toggleHorario} id={idLinea} />
    )
  }
  if (openTarifa) {
    return (<ViewTarifa toggle={toggleTarifa} id={idLinea} />)
  }
  if (openBus) {
    return (<ViewBus toggle={toggleBus} id={idLinea} />)
  }
  if(openBusRoad){
    return(<BusRoad togglePrevia={togglePrevia} toggle={toggleBusRuta} data={lineaData} SetSelectionRuta={setSelectionRuta}/>)
  }
  if (openPrevia) {
    return (
      <ViewMap data={selectionRuta} onClose={togglePrevia} toggleRutas={toggleBusRuta} />
    )
  }
  return (
    <Grid container spacing={6} >
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Registro de lineas' sx={{ pb: 0, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
          <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <Button variant="contained" sx={{ height: 43 }} onClick={toggleFilter}>
              {openfilters ? 'Cerrar filtrado' : 'Filtrar por columnas'}
            </Button>
            <Button sx={{ mb: 2, mt: { xs: 3, sm: 0 } }} onClick={toggleDrawer} variant='contained'>
              Nuevo linea
            </Button>
          </Box>
          {openfilters ? <Box sx={{ pt: 0, pl: 5, pr: 5, pb: 3 }}>
            <Card sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={2.4}>
                  <FormControl fullWidth sx={{ mb: 1 }}>
                    <TextField label='Nombre de la linea'
                      variant='standard'
                      name="name"
                      fullWidth
                      autoComplete='off'
                      value={filters.name}
                      onChange={handleChangeFields}
                      InputProps={{
                        startAdornment: <FilterListIcon />,
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={2.4}>
                  <FormControl fullWidth sx={{ mb: 1 }}>
                    <TextField label='Rutas y paradas'
                      variant='standard'
                      name="road"
                      fullWidth
                      value={filters.road}
                      onChange={handleChangeFields}
                      autoComplete='off'
                      InputProps={{
                        startAdornment: <FilterListIcon />,
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={2.4}>
                  <FormControl fullWidth sx={{ mb: 1 }}>
                    <TextField label='Horario'
                      variant='standard'
                      fullWidth
                      name="horario"
                      value={filters.horario}
                      onChange={handleChangeFields}
                      autoComplete='off'
                      InputProps={{
                        startAdornment: <FilterListIcon />,
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={2.4}>
                  <FormControl fullWidth sx={{ mb: 1 }}>
                    <TextField label='Tarifa'
                      variant='standard'
                      fullWidth
                      name="rate"
                      value={filters.rate}
                      onChange={handleChangeFields}
                      autoComplete='off'
                      InputProps={{
                        startAdornment: <FilterListIcon />,
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={2.4}>
                  <FormControl fullWidth sx={{ mb: 1 }}>
                    <TextField label='buses'
                      variant='standard'
                      fullWidth
                      name="buses"
                      value={filters.buses}
                      onChange={handleChangeFields}
                      autoComplete='off'
                      InputProps={{
                        startAdornment: <FilterListIcon />,
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Box>
                    <Button variant="contained" sx={{ mr: 3 }} onClick={handleFilters}>Filtrar</Button>
                    <Button variant="outlined" onClick={handleReset}>Restablecer</Button>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Box> : ''}
          <DataGrid
            autoHeight
            rows={store.data}
            columns={columns}
            pagination
            pageSize={pageSize}
            disableSelectionOnClick
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[10, 25, 50]}
            rowCount={store.total}
            paginationMode="server"
            onPageChange={(newPage) => setPage(newPage)}
            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
          />
        </Card>
      </Grid>
      <AddDraw open={openAdd} toggle={toggleDrawer} title='Registro de la linea'>
        <AddLinea toggle={toggleDrawer} />
      </AddDraw>
      <AddDraw open={openEdit} toggle={toggleEdit} title="Editar linea">
        <EditLinea toggle={toggleEdit} dataEdit={lineaData} page={page} pageSize={pageSize} open={openEdit}/>
      </AddDraw>
      <ListRoad open={openListRoad} toggle={toggleListRoad} id={idLinea} />
    </Grid>
  )
}
export default Lineas
