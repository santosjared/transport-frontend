import { Avatar, Box, Card, CardHeader,Grid, IconButton, Link, Menu, MenuItem, Typography } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { useCallback, useEffect, useState, MouseEvent,} from "react"
import AddDraw from "src/components/addDraw"
import TableHeader from "src/components/tableHeader"
import { useService } from "src/hooks/useService"
import Register from "./register"
import CustomChip from 'src/@core/components/mui/chip'
import Icon from "src/@core/components/icon"
import { useSocket } from "src/hooks/useSocket"
import DialogUsers from "./Dialog"
import getConfig from 'src/configs/environment'
import { useDispatch,useSelector } from "react-redux"
import { deleteDevice } from "src/store/apps/device"
import { RootState, AppDispatch } from 'src/store'

type Divice = {
  id: string
  name: string
  brand: string
  idUser:string
  connect: boolean
  status: boolean
}
interface TypeCell {
  row: Divice
}

const Users = ({id}:{id:number|string}) =>{

  const {GetId} = useService()
  const [user, setUser] = useState<any>()

  useEffect(()=>{
    const fetchData = async() =>{
      const data = await GetId('/users',id)
      setUser(data.data)
    }
    fetchData()
  },[id])
  return(
    <Box sx={{display:'flex', justifyContent:'space-between'}}>{id?
    <><Avatar alt='profile' src={`${getConfig().backendURI}${user?.profile}`} sx={{border:'solid 1px #E0E0E0'}}/>
    <Typography variant='body2' sx={{margin:2}}>{`${user?.name} ${user?.lastName}`}</Typography></>:
    <Typography noWrap variant="body2" color={'error'}>No Asignado</Typography>}
  </Box>)
}
const Gps = () => {

  const [pageSize, setPageSize] = useState<number>(10)
  const [value, setValue] = useState<string>('')
  const [openAdd, setOpenAdd] = useState<boolean>(false)
  const [data, setdata] = useState<[]>([])
  const [openUsers, setOpenUsers] = useState(false)
  const [diviceId, setDiviceId] = useState<string | number>('')

  const { socket, isConnected, isLoading, isError } = useSocket()
  const RowOptions = ({ id }: { id: number | string }) => {

    const dispatch = useDispatch<AppDispatch>()

    const { Delete} = useService()

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const rowOptionsOpen = Boolean(anchorEl)

    const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget)
    }
    const handleUsersClick = () => {
      setDiviceId(id)
      DrawUser();
      setAnchorEl(null)
    }
    const handleRowOptionsClose = () => {
      setAnchorEl(null)
    }

    const handleDelete = () => {
      Delete('/divice', id)
      if (isConnected) {
        socket?.emit('datadivice')
        socket?.on('diviceAll', (data) => {
          setdata(data)
        })
      }
      handleRowOptionsClose()
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
            component={Link}
            sx={{ '& svg': { mr: 2 } }}
            onClick={handleUsersClick}
          >
            <Icon icon='healthicons:truck-driver' fontSize={20} color='#00a0f4' />
            Asignar Chofer
          </MenuItem>
          <MenuItem onClick={handleRowOptionsClose} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='mdi:pencil-outline' fontSize={20} color='#00a0f4' />
            Editar
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='mdi:delete-outline' fontSize={20} color="red" />
            Dar de baja
          </MenuItem>
        </Menu>
      </>
    )
  }
  const columns = [
    {
      flex: 0.2,
      field: 'name',
      minWidth: 90,
      headerName: 'Nombre',
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
      field: 'user',
      headerName: 'Choferes',
      minWidth: 160,
      renderCell: ({row}:TypeCell)=>{
        return(
          <Users id={row.idUser}/>
        )
      }
    },
    {
      flex: 0.2,
      field: 'conect',
      minWidth: 70,
      headerName: 'Estado de Conexion',
      renderCell: ({ row }: TypeCell) => {

        return (
          <CustomChip
            skin='light'
            size='small'
            label={row.connect ? 'Conectado' : 'Desconectado'}
            color={row.connect ? 'success' : 'error'}
            sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
          />
        )
      }
    },
    {
      flex: 0.2,
      field: 'status',
      minWidth: 70,
      headerName: 'Estados',
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
      field: 'actions',
      minWidth: 70,
      headerName: 'Acciones',
      renderCell: ({ row }: TypeCell) => {
        return (<RowOptions id={row.id} />)
      }
    }
  ]
 
  
  const DrawUser = () => setOpenUsers(!openUsers)

  useEffect(() => {
    if (isConnected) {
      socket?.emit('datadivice')
      socket?.on('diviceAll', (data) => {
        setdata(data)
      })
    }
  }, [isConnected, socket])

  const handleFilter = useCallback((val: string) => {
  }, [])
  const toggleDrawer = () => setOpenAdd(!openAdd)

  
  return (
    <Grid container spacing={6} >
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Registro de gps' sx={{ pb: 0, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            toggle={toggleDrawer}
            placeholder='Busquedad de gps'
            title='Nuevo dispositivo'
            disable={isError || isLoading}
          />
          {isLoading ? <Box sx={{ textAlign: 'center' }}>Cargando datos...</Box> : !isError ?
            <DataGrid
              autoHeight
              rows={data}
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
      <AddDraw open={openAdd} toggle={toggleDrawer} title='Registro de gps'>
        <Register toggle={toggleDrawer} />
      </AddDraw>
      <DialogUsers toggle={DrawUser} open={openUsers} id={diviceId}></DialogUsers>
    </Grid>
  )
}
export default Gps