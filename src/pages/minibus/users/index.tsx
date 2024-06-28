import React, { useCallback, useState, MouseEvent, useEffect, ChangeEvent } from 'react'
import { Avatar, Box, Button, Card, CardHeader, FormControl, Grid, IconButton, InputLabel, Select, TextField, Typography } from '@mui/material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import { DataGrid } from "@mui/x-data-grid"
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import Icon from 'src/@core/components/icon'
import AddDraw from 'src/components/addDraw'
import AddChofer from './register'
import TableHeader from 'src/components/tableHeader'
import getConfig from 'src/configs/environment'
import FilterListIcon from '@mui/icons-material/FilterList';
import { RootState, AppDispatch } from 'src/store'
import { fetchData, deleteUser, findOneUser } from 'src/store/apps/users'
import { useSelector } from 'react-redux'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import { isImage } from 'src/utils/verificateImg'
import Swal from 'sweetalert2'
import EditUser from './edit'
import ViewLicence from './licence'

interface TypeRol{
  name:string
}
interface UsersType {
  id: string;
  name: string;
  lastName: string;
  ci: string;
  address: string;
  phone: string;
  gender: string;
  contry: string;
  email: string
  profile: string;
  licenceId: any;
  rol:TypeRol ;
}

const defaultFilter = {
  name: '',
  lastName: '',
  ci: '',
  address: '',
  phone: '',
  gender: '',
  contry: '',
  email: '',
  rol: '',
}
interface CellType {
  row: UsersType
}
interface UserRoleType {
  [key: string]: { icon: string; color: string }
}
const userRoleObj: UserRoleType = {
  admin: { icon: 'mdi:laptop', color: 'error.main' },
  driver: { icon: 'healthicons:truck-driver-negative', color: 'warning.main' },
  other: { icon: 'mdi:account-outline', color: 'primary.main' }
}
const renderClient = (row: UsersType) => {
  const [isImg, setIsImg] = useState<any>(false)
  useEffect(() => {
    const image = async () => {
      const img = await isImage(`${getConfig().backendURI}${row.profile}`)
      setIsImg(img)
    }
    image()
  }, [row.profile])
  if (isImg) {
    return <CustomAvatar src={`${getConfig().backendURI}${row.profile}`} sx={{ mr: 3, width: 34, height: 34 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color='primary'
        sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}
      >
        {getInitials(row.name && row.lastName ? `${row.name} ${row.lastName}` : row.name ? row.name : 'Desconocido')}
      </CustomAvatar>
    )
  }
}

const Users = () => {
  const RowOptions = ({ id, user }: { id: string; licence: any, user: UsersType }) => {

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
        dispatch(deleteUser({filters:{filter: '', skip: page * pageSize, limit: pageSize},id:id})).then((result) => {
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
          <MenuItem onClick={() => { handleRowOptionsClose(); handleViewLicence(user) }} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='ph:user-bold' fontSize={20} color='#00a0f4' />
            Detalles
          </MenuItem>
          <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={() => { handleRowOptionsClose(); handleEditOnclik(id) }}>
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
      minWidth: 230,
      field: 'fullName',
      headerName: 'Nombres y Apellidos',
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(row)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: theme => `${theme.palette.text.secondary}` }}>{`${row.name} ${row.lastName}`}</Typography>
              <Typography noWrap variant='caption'>
                {row.email}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 90,
      field: 'ci',
      sortable: false,
      headerName: 'CI',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography variant='body2' noWrap>{row.ci}</Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 90,
      field: 'address',
      sortable: false,
      headerName: 'Dirección',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography variant='body2' noWrap>{row.address}</Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 90,
      field: 'phone',
      sortable: false,
      headerName: 'Celular',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>{row.phone}</Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 90,
      field: 'gender',
      sortable: false,
      headerName: 'Género',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>{row.gender}</Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 90,
      field: 'contry',
      sortable: false,
      headerName: 'Nacionalidad',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography noWrap variant='body2'>{row.contry}</Typography>
        )
      }
    },
    {
      flex: 0.15,
      field: 'rol',
      minWidth: 150,
      headerName: 'Rol',
      renderCell: ({ row }: CellType) => {
        return (
          <Typography variant='body2'>
            {!row.rol ? 'Niguno' :
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  '& svg': { mr: 3, color: userRoleObj[row.rol.name == 'Administrador' ? 'admin' : row.rol.name == 'Chofer' ? 'driver' : 'other'].color }
                }}>
                  <Icon icon={userRoleObj[row.rol.name == 'Administrador' ? 'admin' : row.rol.name == 'Chofer' ? 'driver' : 'other'].icon} fontSize={20} />
                  <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
                    {row.rol.name}
                  </Typography>
                </Box>
            }
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 90,
      field: 'actions',
      sortable: false,
      headerName: 'Acciones',
      renderCell: ({ row }: CellType) => {
        return (<RowOptions id={row.id} licence={row.licenceId} user={row} />)
      }
    }
  ]
  const [pageSize, setPageSize] = useState<number>(10)
  const [page, setPage] = useState<number>(0)
  const [drawOpen, setDrawOpen] = useState<boolean>(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [id, setId] = useState('')
  const [openLicence, setOpenLicence] = useState(false)
  const [userData, setUserdata] = useState<any>(null)
  const [openfilters, setOpenFilters] = useState(false)
  const [filters, setFilters] = useState(defaultFilter)

  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.users)
  useEffect(() => {
    dispatch(fetchData({ filter: '', skip: page * pageSize, limit: pageSize }))
  }, [pageSize, page])

  const toggleDrawer = () => setDrawOpen(!drawOpen)
  const toggleEdit = () => setOpenEdit(!openEdit)
  const toggleLicence = () => setOpenLicence(!openLicence)
  const toggleFilter = () => setOpenFilters(!openfilters)
  const handleEditOnclik = (id: string) => {
    setId(id)
    toggleEdit()
  }
  const handleViewLicence = (data: UsersType) => {
    setUserdata(data)
    toggleLicence()
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
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Registro de usuarios' sx={{ pb: 0, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
          <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <Button variant="contained" sx={{ height: 43 }} onClick={toggleFilter}>
              {openfilters ? 'Cerrar filtrado' : 'Filtrar por columnas'}
            </Button>
            <Button sx={{ mb: 2, mt: { xs: 3, sm: 0 } }} onClick={toggleDrawer} variant='contained'>
              Nuevo usuario
            </Button>
          </Box>
          {openfilters ? <Box sx={{ pt: 0, pl: 5, pr: 5, pb: 3 }}>
            <Card sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={1.7}>
                  <FormControl fullWidth sx={{ mb: 1 }}>
                    <TextField label='Usuarios'
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
                <Grid item xs={1.7}>
                  <FormControl fullWidth sx={{ mb: 1 }}>
                    <TextField label='Ci'
                      variant='standard'
                      name="ci"
                      fullWidth
                      value={filters.ci}
                      onChange={handleChangeFields}
                      autoComplete='off'
                      InputProps={{
                        startAdornment: <FilterListIcon />,
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={1.7}>
                  <FormControl fullWidth sx={{ mb: 1 }}>
                    <TextField label='Dirección'
                      variant='standard'
                      fullWidth
                      name="address"
                      value={filters.address}
                      onChange={handleChangeFields}
                      autoComplete='off'
                      InputProps={{
                        startAdornment: <FilterListIcon />,
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={1.7}>
                  <FormControl fullWidth sx={{ mb: 1 }}>
                    <TextField label='Celular'
                      variant='standard'
                      fullWidth
                      name="phone"
                      value={filters.phone}
                      onChange={handleChangeFields}
                      autoComplete='off'
                      InputProps={{
                        startAdornment: <FilterListIcon />,
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={1.7}>
                  <FormControl fullWidth sx={{ mb: 1 }}>
                    <TextField label='Género'
                      variant='standard'
                      fullWidth
                      name="gender"
                      value={filters.gender}
                      onChange={handleChangeFields}
                      autoComplete='off'
                      InputProps={{
                        startAdornment: <FilterListIcon />,
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={1.7}>
                  <FormControl fullWidth sx={{ mb: 1 }}>
                    <TextField label='Nacionalidad'
                      variant='standard'
                      fullWidth
                      name="contry"
                      value={filters.contry}
                      onChange={handleChangeFields}
                      autoComplete='off'
                      InputProps={{
                        startAdornment: <FilterListIcon />,
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={1.7}>
                  <FormControl fullWidth sx={{ mb: 1 }}>
                    <TextField label='Rol'
                      variant='standard'
                      fullWidth
                      name="rol"
                      value={filters.rol}
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
            loading={store.isLoading}
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
      <AddDraw open={drawOpen} toggle={toggleDrawer} title='Registro del usuario'>
        <AddChofer toggle={toggleDrawer} page={page} pageSize={pageSize}/>
      </AddDraw>

      <AddDraw open={openEdit} toggle={toggleEdit} title='Editar usuario'>
        <EditUser toggle={toggleEdit} id={id} store={openEdit} />
      </AddDraw>
      <ViewLicence open={openLicence} toggle={toggleLicence} data={userData} />
    </Grid>
  )
}
export default Users
