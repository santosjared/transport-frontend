import React, { useCallback, useState, MouseEvent, useEffect } from 'react'
import { Avatar, Box, Button, Card, CardHeader, FormControl, Grid, IconButton, InputLabel, Select, Typography } from '@mui/material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import { DataGrid } from '@mui/x-data-grid'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import Icon from 'src/@core/components/icon'
import AddDraw from 'src/components/addDraw'
import AddChofer from './register'
import TableHeader from 'src/components/tableHeader'
import getConfig from 'src/configs/environment'
import CustomChip from 'src/@core/components/mui/chip'
import { RootState, AppDispatch } from 'src/store'
import { fetchData, deleteUser, findOneUser } from 'src/store/apps/users'
import { useSelector } from 'react-redux'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import { isImage } from 'src/utils/verificateImg'
import { useService } from 'src/hooks/useService'
import Swal from 'sweetalert2'
import EditUser from './edit'
import ViewLicence from './licence'


interface UsersType {
  id:string;
  name: string;
  lastName: string;
  ci: string;
  address: string;
  phone: string;
  gender: string;
  contry: string;
  email: string
  profile: string;
  licenceId:any;
  rol: [];
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
  const [isImg,setIsImg] = useState<any>(false)
  useEffect(()=>{
    const image = async()=>{
      const img = await isImage(`${getConfig().backendURI}${row.profile}`)
      setIsImg(img)
    }
    image()
  },[row.profile])
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
  const RowOptions = ({ id, licence, user }: { id: string; licence:any, user:UsersType}) => {

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
          cancelButtonText:'Cancelar',
          confirmButtonColor:'#ff4040',
          confirmButtonText: 'Eliminar',
        }).then(async(result)=>{return await result.isConfirmed});
        if(confirme)
        {
            dispatch(deleteUser(id)).then((result)=>{
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
          {licence?    <MenuItem onClick={()=>{handleRowOptionsClose(); handleViewLicence(user)}} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='solar:card-2-broken' fontSize={20} color='#00a0f4' />
            ver licence
          </MenuItem>:''}
          <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={()=>{handleRowOptionsClose(); handleEditOnclik(id)}}>
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
          {row.rol.length==0?'Niguno':
          row.rol.map((role:any)=>(
            <Box sx={{ display: 'flex', 
            alignItems: 'center', 
            '& svg': { mr: 3, color: userRoleObj[role.name =='Administrador'?'admin':role.name == 'Chofer'? 'driver':'other'].color } }}>
            <Icon icon={userRoleObj[role.name =='Administrador'?'admin':role.name == 'Chofer'? 'driver':'other'].icon} fontSize={20} />
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {role.name}
            </Typography>
          </Box>
          ))
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
        return (<RowOptions id={row.id} licence={row.licenceId} user={row}/>)
      }
    }
  ]  
  const [pageSize, setPageSize] = useState<number>(10)
  const [pageNumber, setPageNumber] = useState(0);
  const [value, setValue] = useState<string>('')
  const [drawOpen, setDrawOpen] = useState<boolean>(false)
  const [openEdit,setOpenEdit]=useState(false)
  const [id,setId] = useState('')
  const [openLicence, setOpenLicence] = useState(false)
  const [userData, setUserdata] = useState<any>(null)

  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.users)
  useEffect(() => {
    dispatch(fetchData({filter:'',skip:pageNumber,limit:pageSize}))
  }, [dispatch,pageSize,pageNumber])
  const handleFilter = useCallback((val: string) => {
    dispatch(fetchData({filter:val}))
    setValue(val)
  }, [])
  const toggleDrawer = () => setDrawOpen(!drawOpen)
  const toggleEdit = ()=>setOpenEdit(!openEdit)
  const toggleLicence = () =>setOpenLicence(!openLicence)
  const handleEditOnclik=(id:string)=>{
    setId(id)
    toggleEdit()
  }
  const handleViewLicence = (data:UsersType) =>{
    setUserdata(data)
    toggleLicence()
  }
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Registro de usuarios' sx={{ pb: 0, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            toggle={toggleDrawer}
            placeholder='Busquedad de Usuarios'
            title='Nuevo Usuario'
          ></TableHeader>
          {store.isLoading ? <Box sx={{ textAlign: 'center' }}>Cargando datos...</Box> : !store.isError ?
            <DataGrid
              autoHeight
              rows={store.data}
              columns={columns}
              rowCount={store.total}
              pageSize={pageSize}
              disableSelectionOnClick
              rowsPerPageOptions={[10, 25, 50]}
              sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
              onPageChange={(newPageNumber) => setPageNumber(newPageNumber)}
              onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
            /> : ''
          }
        </Card>
      </Grid>
      <AddDraw open={drawOpen} toggle={toggleDrawer} title='Registro del usuario'>
        <AddChofer toggle={toggleDrawer} />
      </AddDraw>

      <AddDraw open={openEdit} toggle={toggleEdit} title='Editar usuario'>
      <EditUser toggle={toggleEdit} id={id} store={openEdit}/>
      </AddDraw>
      <ViewLicence open={openLicence} toggle={toggleLicence} data={userData}/>
    </Grid>
  )
}
export default Users