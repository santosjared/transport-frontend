import { Box, Card, CardHeader, Grid, IconButton, Link, Menu, MenuItem, Typography } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { useCallback, useEffect, useState,MouseEvent } from "react"
import { useQuery } from "react-query"
import AddDraw from "src/components/addDraw"
import TableHeader from "src/components/tableHeader"
import { useService } from "src/hooks/useService"
import Conect from "./conect"
import io from 'socket.io-client';
import getConfig from 'src/configs/environment'
import Register from "./register"
import CustomChip from 'src/@core/components/mui/chip'
import Icon from "src/@core/components/icon"
import { useSocket } from "src/hooks/useSocket"

interface Data {
    name:string,
    brand:string,
    model:string,
    key:string,
    lat:number,
    lng:number
  }
  type Divice = {
    id:string
    name:string
    brand:string
    model:string
    connect:boolean
    status:boolean
  }
  interface TypeCell {
    row:Divice
  }
  const RowOptions = ({ id }: { id: number | string }) => {
    // ** Hooks
   // const dispatch = useDispatch<AppDispatch>()
  
    // ** State
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  
    const rowOptionsOpen = Boolean(anchorEl)
  
    const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget)
    }
    const handleRowOptionsClose = () => {
      setAnchorEl(null)
    }
  
    const handleDelete = () => {
     // dispatch(deleteBus(id))
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
            onClick={handleRowOptionsClose}
            href='/apps/user/view/overview/'
          >
            <Icon icon='healthicons:truck-driver' fontSize={20} color='#00a0f4'/>
            Asignar Chofer
          </MenuItem>
          <MenuItem onClick={handleRowOptionsClose} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='mdi:pencil-outline' fontSize={20} color='#00a0f4'/>
            Editar
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='mdi-light:delete' fontSize={20} color=' #f52b00 '/>
            Dar de Baja
          </MenuItem>
        </Menu>
      </>
    )
  }
 
const columns = [
    {
        flex:0.2,
        field:'name',
        headerName:'Nombre',
        renderCell: ({row}:TypeCell)=>{
            return(
            <Typography noWrap variant='body2'>
            {row.name}
          </Typography>
            )
          }
    },
    {
        flex:0.2,
        field:'brand',
        headerName:'Marca',
        renderCell: ({row}:TypeCell)=>{
            return(
            <Typography noWrap variant='body2'>
            {row.brand}
          </Typography>
            )
          }
    },
    {
        flex:0.2,
        field:'model',
        headerName:'Modelo',
        renderCell: ({row}:TypeCell)=>{
            return(
            <Typography noWrap variant='body2'>
            {row.model}
          </Typography>
            )
          }
    },
    {
        flex:0.2,
        field:'conect',
        headerName:'Estado de Conexion',
        renderCell: ({ row }: TypeCell) => {
          
          return (
            <CustomChip
              skin='light'
              size='small'
              label={row.connect? 'Conectado':'Desconectado'}
              color={row.connect? 'success':'error'}
              sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
            />
          )
        }
    },
    {
        flex:0.2,
        field:'status',
        headerName:'Estados',
        renderCell: ({ row }: TypeCell) => {
          
            return (
              <CustomChip
                skin='light'
                size='small'
                label={row.status? 'Activo':'Inactivo'}
                color={row.status? 'success':'secondary'}
                sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
              />
            )
          }
    },
    {
        flex:0.2,
        field:'actions',
        headerName:'Acciones',
        renderCell:({row}:TypeCell)=>{
            return(<RowOptions id={row.id}/>)
        }
    }
]
const Gps = ()=>{
  
    const [pageSize,setPageSize]=useState<number>(10)
    const [value, setValue] = useState<string>('')
    const [openAdd, setOpenAdd] = useState<boolean>(false)
    const [info, setInfo] = useState<boolean>(false)
    const [divice, setDivice] = useState<Data>({name:'',brand:'',model:'',key:'', lat:0,lng:0})
    const [data,setdata] = useState<[]>([])

    const {Get}=useService()
    // const {data,isLoading,isError} = useQuery('divice',()=>Get('/divice'))
    const {socket, isConnected, isLoading,isError} = useSocket()
   
    useEffect(()=>{
      if(isConnected){
        socket?.emit('divice')
        socket?.on('diviceAll',(data)=>{
          setdata(data)
        })
      }
    },[isConnected,socket])
    useEffect(()=>{
      if(isConnected){
        socket?.on('newDivice',(data)=>{
          setDivice(data)
          setInfo(true)
        })
      }
    },[isConnected,socket])
    const handleFilter = useCallback((val: string) => {
        //setValue(val)
    },[])
    const toggleDrawer = () =>setOpenAdd(!openAdd)
    return(
        <Grid container spacing={6} >
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Registro de gps' sx={{pb:0, '& .MuiCardHeader-title':{letterSpacing:'.15px'}}} />
                    <TableHeader 
                    value={value} 
                    handleFilter={handleFilter} 
                    toggle={toggleDrawer}  
                    placeholder='Busquedad de gps'
                    title='Conectar nuevo gps'
                    disable={isError || isLoading}
                    />
                    {isLoading?<Box sx={{textAlign:'center'}}>Cargando datos...</Box>:!isError?
                    <DataGrid
                    autoHeight
                    rows={data}
                    columns={columns}
                    pageSize={pageSize}
                    disableSelectionOnClick
                    rowsPerPageOptions={[10,25,50]}
                    sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
                    onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
                    />:''
                    }
                </Card>
            </Grid>
            <AddDraw open={openAdd} toggle={toggleDrawer} title='Registro de gps'>
                {info?<Register data={divice} toggle = {toggleDrawer} setInfo={setInfo}/>:<Conect toggle={openAdd}/>}
            </AddDraw>
        </Grid>
    )
}
export default Gps