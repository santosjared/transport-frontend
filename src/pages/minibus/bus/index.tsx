import React, {useState, MouseEvent, useEffect, ChangeEvent } from 'react'
import { Box, Button, Card, CardHeader, FormControl, Grid, IconButton, InputLabel, Select, SelectChangeEvent, TextField, Typography } from '@mui/material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import { DataGrid } from '@mui/x-data-grid'
import Link from 'next/link'
import CustomChip from 'src/@core/components/mui/chip'
import { AppDispatch, RootState } from 'src/store'
import { useSelector, useDispatch } from 'react-redux'
import { deleteBus, fetchData } from 'src/store/apps/bus'
import getConfig from '../../../configs/environment'
import AddDraw from 'src/components/addDraw'
import RegisterBus from './register'
import DialogUsers from './Dialog'
import { isImage } from 'src/utils/verificateImg'
import Swal from 'sweetalert2'
import EditBus from './edit'
import Icon from "src/@core/components/icon"
import Details from './details'
import FilterListIcon from '@mui/icons-material/FilterList';
import CustomRenderCell from './profile'
import { apiService } from 'src/store/services/apiService'

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

const defaultFilter = {
  trademark: '',
  model: '',
  type: '',
  plaque: '',
  cantidad: '',
  status: '',
  ruat:'',
  userId:''
}
interface TypeCell {
  row: Bus
}

const StyledLink = styled(Link)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))
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
const Bus = () => {
  const RowOptions = ({ id ,user,row}: { id: string, user?:any, row?:any }) => {
    const dispatch = useDispatch<AppDispatch>()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const rowOptionsOpen = Boolean(anchorEl)

    const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget)
    }
    const handleRowOptionsClose = () => {
      setAnchorEl(null)
    }
    const handleAssigned =() =>{
      if(user){
        setIdBus(id)
        handleViewDetails(user)
      }else{
        handleUsersClick()
      }
    }
    const handleUsersClick = () => {
       DrawUser();
       setIdBus(id)
      setAnchorEl(null)
    }
    const handleDelete = async () => {
      handleRowOptionsClose()
        const confirme = await Swal.fire({
          title: '¿Estas seguro de eliminar?',
          icon: "warning",
          showCancelButton: true,
          cancelButtonColor: "#3085d6",
          cancelButtonText:'Cancelar',
          confirmButtonColor:'#ff4040',
          confirmButtonText: 'Eliminar',
        }).then(async(result)=>{return await result.isConfirmed});
        if(confirme)
        {
            dispatch(deleteBus(id)).then((result)=>{
              if(result.payload){
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
          <MenuItem
            sx={{ '& svg': { mr: 2 } }}
            onClick={handleAssigned}
          >
            <Icon icon='healthicons:truck-driver' fontSize={20} color='#00a0f4' />
           {user?'Detalles': "Asignar Chofer"}
          </MenuItem>
         { rules.some((rule:any) => rule.name === 'Editar-microbus') &&<MenuItem onClick={()=>{handleRowOptionsClose(); handleEditOnclik(row)}} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='mdi:pencil-outline' fontSize={20} color='#00a0f4' />
            Editar
          </MenuItem>}
          {rules.some((rule:any) => rule.name === 'Eliminar-microbus') &&<MenuItem sx={{ '& svg': { mr: 2 } }} onClick={handleDelete}>
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
      renderCell: ({ row }: TypeCell) => <CustomRenderCell row={row}/>
    },
    {
      flex: 0.2,
      minWidth:90,
      field:'ruat',
      headerName:'Ruat',
      renderCell:({row}:TypeCell)=>{
        return(
          <>
          {row.ruat?<Typography noWrap variant='body2' component={StyledLink}
          href={`${getConfig().backendURI}${row.ruat}`}
          target='_blank'
          >
            <Icon icon='teenyicons:pdf-solid' fontSize={13} color='#ff3b19'/>Abrir</Typography>:<Typography noWrap variant='body2'>Sin Documento</Typography>}
          </>
        )
      }
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
            color={row.status?.name === 'Activo'? 'success' : row.status?.name === 'En mantenimiento'?'warning':row.status?.name === 'Inactivo'?'secondary':'info'}
            sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
          />
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
        return (<RowOptions id={row.id} user={row.userId} row={row}/>)
      }
    }
  ]
  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState(0);
  const [draw, setDraw] = useState<boolean>(false)
  const [openUsers, setOpenUsers] = useState(false)
  const [openDetails, setopenDetails] = useState(false)
  const [idBus, setIdBus] = useState<string>('')
  const [openEdit,setOpenEdit]=useState(false)
  const [userData, setUserdata] = useState<any>(null)
  const [openfilters, setOpenFilters] = useState(false)
  const [rules,setRules] = useState<string[]>([])
  const [busData,setBusData] = useState<any>(null)
  const [filters,setFilters] = useState(defaultFilter)

  useEffect(() => {
    const fetch = async () => {
      const response = await apiService.Get('/auth')
      if (response.data && response.data.access) {
        setRules(response.data.access)
      }
    }
    fetch()
  }, [])
  const dispatch = useDispatch<AppDispatch>()
  const  store = useSelector((state: RootState) => state.bus)
  useEffect(() => {
    dispatch(fetchData({ filter: '', skip: page * pageSize, limit: pageSize }))
  }, [pageSize, page])
  const toggleDrawer = () => setDraw(!draw)
  const DrawUser = () => setOpenUsers(!openUsers)
  const toggleEdit = ()=>setOpenEdit(!openEdit)
  const toggleDetails = () =>setopenDetails(!openDetails)
  const toggleFilter = () =>setOpenFilters(!openfilters)

  const handleEditOnclik=(data:any)=>{
    setBusData(data)
    toggleEdit()
  }

  const handleViewDetails = (data:UsersType) =>{
    setUserdata(data)
    toggleDetails()
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
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Lista de Microbuses' sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
          <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>
            <Button variant="contained" sx={{ height: 43 }} onClick={toggleFilter}>
              {openfilters ? 'Cerrar filtrado' : 'Filtrar por columnas'}
            </Button>

            {rules.some((rule:any) => rule.name === 'Crear-microbus') &&<Button sx={{ mb: 2, mt:{xs:3,sm:0}  }} onClick={toggleDrawer} variant='contained'>
              Nuevo microbus
            </Button>}
          </Box>
          {openfilters ? <Box sx={{ pt: 0, pl: 5, pr: 5, pb: 3 }}>
        <Card sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={1.5}>
              <FormControl fullWidth sx={{ mb: 1 }}>
                <TextField label='Marca'
                  variant='standard'
                  name="trademark"
                  fullWidth
                  autoComplete='off'
                  value={filters.trademark}
                  onChange={handleChangeFields}
                  InputProps={{
                    startAdornment: <FilterListIcon />,
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={1.5}>
              <FormControl fullWidth sx={{ mb: 1 }}>
                <TextField label='Modelo'
                  variant='standard'
                  name="model"
                  fullWidth
                  value={filters.model}
                  onChange={handleChangeFields}
                  autoComplete='off'
                  InputProps={{
                    startAdornment: <FilterListIcon />,
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={1.5}>
              <FormControl fullWidth sx={{ mb: 1 }}>
                <TextField label='Tipo'
                  variant='standard'
                  fullWidth
                  name="type"
                  value={filters.type}
                  onChange={handleChangeFields}
                  autoComplete='off'
                  InputProps={{
                    startAdornment: <FilterListIcon />,
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={1.5}>
              <FormControl fullWidth sx={{ mb: 1 }}>
                <TextField label='Placa'
                  variant='standard'
                  fullWidth
                  name="plaque"
                  value={filters.plaque}
                  onChange={handleChangeFields}
                  autoComplete='off'
                  InputProps={{
                    startAdornment: <FilterListIcon />,
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={1.5}>
              <FormControl fullWidth sx={{ mb: 1 }}>
                <TextField label='Cantidad de Asientos'
                  variant='standard'
                  fullWidth
                  name="cantidad"
                  value={filters.cantidad}
                  onChange={handleChangeFields}
                  autoComplete='off'
                  InputProps={{
                    startAdornment: <FilterListIcon />,
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={1.5}>
              <FormControl fullWidth sx={{ mb: 1 }}>
                <TextField label='Chofer'
                  variant='standard'
                  fullWidth
                  name="userId"
                  value={filters.userId}
                  onChange={handleChangeFields}
                  autoComplete='off'
                  InputProps={{
                    startAdornment: <FilterListIcon />,
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={1.5}>
              <FormControl fullWidth sx={{ mb: 1 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Ruat</InputLabel>
                  <Select
                    variant="standard"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="ruat"
                    value={filters.ruat}
                    onChange={handleChangeSelects}
                    label="Ruat"
                  >
                    <MenuItem value='document'>Con documentos</MenuItem>
                    <MenuItem value='notdocument'>Sin documento</MenuItem>
                  </Select>
                </FormControl>
              </FormControl>
            </Grid>
            <Grid item xs={1.5}>
              <FormControl fullWidth sx={{ mb: 1 }}>
                <TextField label='Estado'
                  variant='standard'
                  fullWidth
                  name="status"
                  value={filters.status}
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
      <AddDraw open={draw} toggle={toggleDrawer} title='Registro de Microbus'>
        <RegisterBus toggle={toggleDrawer} page={page} pageSize={pageSize}/>
      </AddDraw>
      <AddDraw open={openEdit} toggle={toggleEdit} title='Editar Microbus'>
      <EditBus toggle={toggleEdit} data={busData} page={page} pageSize={pageSize}/>
      </AddDraw>
      <DialogUsers open={openUsers} toggle={DrawUser} id={idBus} page={page} pageSize={pageSize}/>
      <Details open={openDetails} toggle={toggleDetails} data={userData} busId={idBus} page={page} pageSize={pageSize}/>
    </Grid>
  )
}
export default Bus
