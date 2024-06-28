import React, { useCallback, useState, MouseEvent, useEffect, ChangeEvent } from 'react'
import { Box, Button, Card, CardHeader, FormControl, Grid, IconButton, TextField, Typography } from '@mui/material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { DataGrid } from '@mui/x-data-grid'
import TableHeader from 'src/components/tableHeader'
import Icon from 'src/@core/components/icon'
import Maps from './map'
import CustomChip from 'src/@core/components/mui/chip'
import Swal from 'sweetalert2'
import { format } from 'date-fns';
import { useDispatch } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { deleteRoad, fetchData } from 'src/store/apps/road'
import { useSelector } from 'react-redux'
import ViewMap from './viewMap'
import MapsEdit from './edit'
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import FilterListIcon from '@mui/icons-material/FilterList';

interface RoadData {
  createdAt: string
  name: string
  status: boolean
  id: string
}


const defaultFilter = {
  createdAt: '',
  name: '',
}

interface TypeCell {
  row: RoadData
}



const Roads = () => {

  const RowOptions = ({ id, data }: { id: number | string; data: RoadData }) => {

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const rowOptionsOpen = Boolean(anchorEl)
    const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget)
    }
    const dispatch = useDispatch<AppDispatch>()
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
        dispatch(deleteRoad(id)).then((result) => {
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
          <MenuItem onClick={() => { handleRowOptionsClose(); handleEdit(data) }} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='mdi:pencil-outline' fontSize={20} color='#00a0f4' />
            Editar
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='mdi:delete-outline' fontSize={20} color='red' />
            Eliminar
          </MenuItem>
        </Menu>
      </>
    )
  }
  const columns = [
    {
      flex: 0.2,
      minWidth: 110,
      field: 'name',
      headerName: 'Nombres de rutas',
      renderCell: ({ row }: TypeCell) => {
        return (
          <Typography noWrap variant='body2'>
            {row.name}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 110,
      field: 'createdAt',
      headerName: 'Fecha de Creación',
      renderCell: ({ row }: TypeCell) => {
        return (
          <Typography noWrap variant='body2'>
            {format(new Date(row.createdAt), 'dd/MM/yyyy')}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 110,
      field: 'road',
      headerName: 'Rutas',
      renderCell: ({ row }: TypeCell) => {
        return (
          <>
            <OpenInNewIcon sx={{ color: `#A0A0A0`, cursor: 'pointer' }} onClick={() => handleData(row)} />
            <Typography noWrap variant='body2' sx={{ cursor: 'pointer' }} onClick={() => handleData(row)}>ver rutas</Typography>
          </>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 110,
      field: 'status',
      variant: 'outlined',
      headerName: 'Estado',
      renderCell: ({ row }: TypeCell) => {
        return (
          <CustomChip
            skin='light'
            size='small'
            label={row.status ? 'Activo' : 'Inactivo'}
            color={row.status ? 'success' : 'secondary'}
            sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
          />
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 110,
      field: 'actions',
      sortable: false,
      headerName: 'Acciones',
      renderCell: ({ row }: TypeCell) => {
        return (<RowOptions id={row.id} data={row} />)
      }
    }
  ]

  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState(0);
  const [hidden, setHidden] = useState<boolean>(false)
  const [openRoad, setOpenRoad] = useState(false)
  const [data, setData] = useState<any>()
  const [openEdit, setOpenEdit] = useState(false)
  const [openfilters, setOpenFilters] = useState(false)
  const [filters, setFilters] = useState(defaultFilter)

  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.road)
  useEffect(() => {
    dispatch(fetchData({filter: '', skip: page * pageSize, limit: pageSize }))
  }, [])

  const toggleDrawer = () => setHidden(!hidden)
  const toggleRoad = () => setOpenRoad(!openRoad)
  const toggleEdit = () => setOpenEdit(!openEdit)
  const toggleFilter = () => setOpenFilters(!openfilters)

  const handleData = (dta: RoadData) => {
    setData(dta)
    toggleRoad()
  }
  const handleEdit = (dta: RoadData) => {
    setData(dta)
    toggleEdit()
  }


  const handleChangeFields = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters({
      ...filters,
      [name]: value
    })
  }

  const handleFilters = ()=>{
    dispatch(fetchData({ filter: filters, skip: page * pageSize, limit: pageSize }))
  }
  const handleReset = () => {
    setFilters(defaultFilter)
    dispatch(fetchData({ filter: '', skip: page * pageSize, limit: pageSize }))
  }
  if (!hidden && !openRoad && !openEdit) {
    return (
      <Grid container spacing={6} >
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Registro de rutas' sx={{ pb: 0, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
            <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              <Button variant="contained" sx={{ height: 43 }} onClick={toggleFilter}>
                {openfilters ? 'Cerrar filtrado' : 'Filtrar por columnas'}
              </Button>
              <Button sx={{ mb: 2, mt: { xs: 3, sm: 0 } }} onClick={toggleDrawer} variant='contained'>
                Nuevo ruta
              </Button>
            </Box>
            {openfilters && <Box sx={{ pt: 0, pl: 5, pr: 5, pb: 3}}>
            <Card sx={{ p: 2, width:{  xs:'auto',sm:'50%', lg:'50%'}}}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth sx={{ mb: 1 }}>
                    <TextField label='nombre de tarifas'
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
                <Grid item xs={6}>
                  <FormControl fullWidth sx={{ mb: 1 }}>
                    <TextField label='Fecha de creación'
                      variant='standard'
                      name="createdAt"
                      type="date"
                      fullWidth
                      value={filters.createdAt}
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
          </Box>}
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
      </Grid>
    )
  }
  else {
    return (
      <>
        {openRoad && <ViewMap data={data} onClose={toggleRoad} />}
        {hidden && <Maps toggle={toggleDrawer} title='Registrar Rutas' />}
        {openEdit && <MapsEdit title='Editar rutas' toggle={toggleEdit} data={data} page={page} pageSize={pageSize}/>}
      </>
    )
  }
}

export default Roads
