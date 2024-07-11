import React, { useState, MouseEvent, useEffect, ChangeEvent } from 'react'
import { Box, Button, Card, CardHeader, FormControl, Grid, IconButton, Menu, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { useQuery } from "react-query"
import AddDraw from "src/components/addDraw"
import TableHeader from "src/components/tableHeader"
// import { useService } from "src/hooks/useService"
import RegisterHorario from "./register"
import CustomChip from 'src/@core/components/mui/chip'
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "src/store"
import { deleteHorario, fetchData } from "src/store/apps/horario"
import Icon from "src/@core/components/icon"
import Swal from "sweetalert2"
import ListDays from './days'
import EditHorario from './edit'
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import FilterListIcon from '@mui/icons-material/FilterList';
import { apiService } from 'src/store/services/apiService'

interface horarioData {
  id: string
  name: string;
  place: string;
  firstOut: string;
  lastOut: string;
  days: string[];
  description: string;
}
const defaultFilter = {
  name: '',
  place: '',
  firstOut: '',
  lastOut: '',
  days: '',
}

interface TypeCell {
  row: horarioData
}


const Horario = () => {
  const RowOptions = ({ id, horari }: { id: string, horari?: any }) => {
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
        dispatch(deleteHorario(id)).then((result) => {
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
         { rules.some((rule:any) => rule.name === 'Editar-horario') &&<MenuItem onClick={() => { handleRowOptionsClose(); handleEdit(horari) }} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='mdi:pencil-outline' fontSize={20} color='#00a0f4' />
            Editar
          </MenuItem>}
         {rules.some((rule:any) => rule.name === 'Eliminar-horario') && <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={handleDelete}>
            <Icon icon='ic:outline-delete' fontSize={20} color='#ff4040' />
            Eliminar
          </MenuItem>}
        </Menu>
      </>
    )
  }
  const columns = [
    {
      flex: 0.2,
      field: 'name',
      headerName: 'Nombre de horario',
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
      field: 'place',
      headerName: 'Lugar de salida',
      renderCell: ({ row }: TypeCell) => {
        return (<Typography noWrap variant='body2'>{row.place}</Typography>
        )
      }
    },
    {
      flex: 0.2,
      field: 'firstOut',
      headerName: 'H. Prim. salida',
      renderCell: ({ row }: TypeCell) => {
        return (
          <Typography noWrap variant='body2'>
            {row.firstOut}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      field: 'lastOut',
      headerName: 'H. últ. salida',
      renderCell: ({ row }: TypeCell) => {
        return (
          <Typography noWrap variant='body2'>
            {row.lastOut}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      field: 'days',
      headerName: 'Días',
      renderCell: ({ row }: TypeCell) => {
        return (<>
          <OpenInNewIcon sx={{ color: `#A0A0A0`, cursor: 'pointer' }} onClick={() => handleListDay(row)} />
          <Typography variant="body2" noWrap sx={{ cursor: 'pointer' }} onClick={() => handleListDay(row)}>ver días</Typography>
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
        return (<RowOptions id={row.id} horari={row} />)
      }
    }
  ]

  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState(0);
  const [draw, setDraw] = useState<boolean>(false)
  const [data, setData] = useState<any>(null)
  const [openListDays, setOpenListDays] = useState(false)
  const [editData, setEditData] = useState<any>(null)
  const [openEdit, setOpenEdit] = useState(false)
  const [openfilters, setOpenFilters] = useState(false)
  const [filters, setFilters] = useState(defaultFilter)
  const [rules, setRules] = useState<string[]>([])

  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.horario)

  useEffect(() => {
    dispatch(fetchData({ filter: '', skip: page * pageSize, limit: pageSize }))
  }, [page,pageSize])


  const toggleDrawer = () => setDraw(!draw)
  const toggleListDays = () => setOpenListDays(!openListDays)
  const toggleEdit = () => setOpenEdit(!openEdit)
  const toggleFilter = () => setOpenFilters(!openfilters)
  const handleListDay = (dta: any) => {
    setData(dta)
    toggleListDays()
  }
  const handleEdit = (dta: any) => {
    setEditData(dta)
    toggleEdit()
  }
  const handleChangeFields = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters({
      ...filters,
      [name]: value
    })
  }
  const handleChangeSelects = (e: SelectChangeEvent) => {
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
  // const {Get} = useService()
  useEffect(() => {
    const fetch = async () => {
      const response = await apiService.Get('/auth')
      if (response.data && response.data.access) {
        setRules(response.data.access)
      }
    }
    fetch()
  }, [])
  return (
    <Grid container spacing={6} >
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Registro de horario' sx={{ pb: 0, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
          <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <Button variant="contained" sx={{ height: 43 }} onClick={toggleFilter}>
              {openfilters ? 'Cerrar filtrado' : 'Filtrar por columnas'}
            </Button>
            {rules.some((rule:any) => rule.name === 'Crear-horario') &&<Button sx={{ mb: 2, mt: { xs: 3, sm: 0 } }} onClick={toggleDrawer} variant='contained'>
              Nuevo horario
            </Button>}
          </Box>
          {openfilters ? <Box sx={{ pt: 0, pl: 5, pr: 5, pb: 3 }}>
            <Card sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={2.4}>
                  <FormControl fullWidth sx={{ mb: 1 }}>
                    <TextField label='Nombre de horario'
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
                    <TextField label='place'
                      variant='standard'
                      name="place"
                      fullWidth
                      value={filters.place}
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
                    <TextField label='Hora de Salida'
                      variant='standard'
                      fullWidth
                      name="firstOut"
                      value={filters.firstOut}
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
                    <TextField label='Ult. Salida'
                      variant='standard'
                      fullWidth
                      name="lastOut"
                      value={filters.lastOut}
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
                    <TextField label='Días'
                      variant='standard'
                      fullWidth
                      name="days"
                      value={filters.days}
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
            localeText={{
              MuiTablePagination: {
                labelRowsPerPage: 'Filas por página:',
              },
            }
          }
          />
        </Card>
      </Grid>
      <AddDraw open={draw} toggle={toggleDrawer} title='Registro de Horarios'>
        <RegisterHorario toggle={toggleDrawer} />
      </AddDraw>
      <AddDraw open={openEdit} toggle={toggleEdit} title='Editar Horario'>
        <EditHorario toggle={toggleEdit} store={editData} page={page} pageSize={pageSize} />
      </AddDraw>
      <ListDays open={openListDays} toggle={toggleListDays} data={data} />
    </Grid>
  )
}
export default Horario
