import { Box, Button, Card, CardHeader, FormControl, Grid, IconButton, Menu, MenuItem, Select, TextField, Typography } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { useCallback, useEffect, useState, MouseEvent, ChangeEvent } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import AddDraw from "src/components/addDraw"
import TableHeader from "src/components/tableHeader"
import { useService } from "src/hooks/useService"
import AddTarifas from "./register"
import FilterListIcon from '@mui/icons-material/FilterList';
import { format } from 'date-fns';
import Icon from "src/@core/components/icon"
import Swal from "sweetalert2"
import { useDispatch } from "react-redux"
import { AppDispatch, RootState } from "src/store"
import { useSelector } from "react-redux"
import { deleteTarifa, fetchData } from "src/store/apps/tarifa"
import ListTarifa from "./list"
import EditTarifas from "./edit"
import OpenInNewIcon from '@mui/icons-material/OpenInNew';


interface rateData {
  createdAt: string
  name: string
  id: string
}
interface TypeCell {
  row: rateData
}

const defaultFilter = {
  name: '',
  createdAt: ''
}
const Tarifas = () => {
  const RowOptions = ({ id, data }: { id: number | string; data: any }) => {

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
        dispatch(deleteTarifa(id)).then((result) => {
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
          <MenuItem onClick={() => handleEdit(data)} sx={{ '& svg': { mr: 2 } }}>
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
      field: 'name',
      headerName: 'Nombre de tarifas',
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
      field: 'createdAt',
      headerName: 'Fecha de creación',
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
      field: 'rate',
      headerName: 'Tarifas',
      renderCell: ({ row }: TypeCell) => {
        return (<>
          <OpenInNewIcon sx={{ color: `#A0A0A0`, cursor: 'pointer' }} onClick={() => handleList(row)} />
          <Typography noWrap variant="body2" sx={{ cursor: 'pointer' }} onClick={() => handleList(row)}>
            ver tarifas
          </Typography>
        </>

        )
      }
    },
    {
      flex: 0.2,
      field: 'actions',
      headerName: 'Acciones',
      renderCell: ({ row }: TypeCell) => {
        return (<RowOptions id={row.id} data={row} />)
      }
    }
  ]

  const [pageSize, setPageSize] = useState<number>(10)
  const [value, setValue] = useState<string>('')
  const [OpenAdd, setOpenAdd] = useState<boolean>(false)
  const [data, setData] = useState<rateData | null>(null)
  const [openList, setOpenList] = useState(false)
  const [editData, setEditData] = useState<any>(null)
  const [openEdit, setOpenEdit] = useState(false)
  const [openfilters, setOpenFilters] = useState(false)
  const [filters, setFilters] = useState(defaultFilter)

  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.tarifa)
  useEffect(() => {
    dispatch(fetchData())
  }, [])
  const toggleDrawer = () => setOpenAdd(!OpenAdd)
  const toggleList = () => setOpenList(!openList)
  const toggleEdit = () => setOpenEdit(!openEdit)
  const toggleFilter = () => setOpenFilters(!openfilters)

  const handleList = (dta: rateData) => {
    setData(dta)
    toggleList()
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
  const handleFilters = () => {

  }
  const handleReset = () => {

  }

  return (
    <Grid container spacing={6} >
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Registro de tarifas' sx={{ pb: 0, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
          <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <Button variant="contained" sx={{ height: 43 }} onClick={toggleFilter}>
              {openfilters ? 'Cerrar filtrado' : 'Filtrar por columnas'}
            </Button>
            <Button sx={{ mb: 2, mt: { xs: 3, sm: 0 } }} onClick={toggleDrawer} variant='contained'>
              Nuevo tarifa
            </Button>
          </Box>
          {openfilters ? <Box sx={{ pt: 0, pl: 5, pr: 5, pb: 3}}>
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
                    <TextField label='Modelo'
                      variant='standard'
                      name="model"
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
          </Box> : ''}
          {store.isLoading ? <Box sx={{ textAlign: 'center' }}>Cargando datos...</Box> : !store.isError ?
            <DataGrid
              autoHeight
              rows={store.data}
              columns={columns}
              pageSize={pageSize}
              disableSelectionOnClick
              rowsPerPageOptions={[10, 25, 50]}
              sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
              onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
            /> : ''
          }
        </Card>
      </Grid>
      <AddDraw open={OpenAdd} toggle={toggleDrawer} title='Registro de Tarifas'>
        <AddTarifas toggle={toggleDrawer} />
      </AddDraw>
      <AddDraw open={openEdit} toggle={toggleEdit} title="Editatr Tarifas">
        <EditTarifas toggle={toggleEdit} data={editData} />
      </AddDraw>
      <ListTarifa open={openList} toggle={toggleList} data={data} />
    </Grid>
  )
}
export default Tarifas
