import { Box, Button, Card, CardHeader, Grid, IconButton, Menu, MenuItem, Typography } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { useCallback, useEffect, useState ,MouseEvent} from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import AddDraw from "src/components/addDraw"
import TableHeader from "src/components/tableHeader"
import { useService } from "src/hooks/useService"
import AddTarifas from "./register"
import { format } from 'date-fns';
import CustomChip from 'src/@core/components/mui/chip'
import Icon from "src/@core/components/icon"
import Swal from "sweetalert2"


interface RoadData {
    createdAt:string
    name:string
    status:boolean
    id:string
  }
  interface TypeCell {
    row:RoadData
  }

  
const RowOptions = ({ id }: { id: number | string }) => {

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const rowOptionsOpen = Boolean(anchorEl)
    const {Delete}=useService()
    const queryClient = useQueryClient()
    const remove = useMutation((id:string | number)=>Delete('/road',id),{
      onSuccess:()=>{
        queryClient.invalidateQueries('roads')
      }
    })
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
        confirmButtonColor:'red',
        confirmButtonText: 'Eliminar',
      }).then(async(result)=>{return await result.isConfirmed});
      if(confirme)
      {
          remove.mutate(id)
      }
    }
    useEffect(()=>{
      if(remove.isSuccess){
        Swal.fire({
          title: '¡Éxito!',
          text: 'Los datos fueron eliminados',
          icon: "success"
        });
      }
      if(remove.isError)
      {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text:'Hubo un error al eliminar los datos, conexion de base de datos fallida o variables de entorno no son correctos',
        });
      }
    },[remove.isSuccess,remove.isError])
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
          <MenuItem onClick={handleRowOptionsClose} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='mdi:pencil-outline' fontSize={20} color='#00a0f4'/>
            Editar
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='mdi:delete-outline' fontSize={20} color='red'/>
            Eliminar
          </MenuItem>
        </Menu>
      </>
    )
  }
const columns = [
    {
        flex:0.2,
        field:'name',
        headerName:'Nombre de tarifas',
        renderCell:({row}:TypeCell)=>{
            return(
              <Typography noWrap variant='body2'>
              {row.name}
            </Typography>
            )
          }
    },
    {
        flex:0.2,
        field:'createdAt',
        headerName:'Fecha de creación',
        renderCell:({row}:TypeCell)=>{
            return(
              <Typography noWrap variant='body2'>
              {format(new Date(row.createdAt), 'dd/MM/yyyy')}
            </Typography>
            )
          }
    },
    {
        flex:0.2,
        field:'details',
        headerName:'Detalles',
        renderCell:()=>{
            return(
                <Typography noWrap variant="body2" >
                    <Button variant="text" sx={{textTransform:'lowercase'}}>ver detalle</Button>
                </Typography>
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
const Tarifas = ()=>{
    const [pageSize,setPageSize]=useState<number>(10)
    const [value, setValue] = useState<string>('')
    const [OpenAdd, setOpenAdd] = useState<boolean>(false)
    const {Get}=useService()
    const {data,isLoading,isError} = useQuery('tarifa',()=>Get('/tarifa'))
    const handleFilter = useCallback((val: string) => {
        setValue(val)
    },[])
    const toggleDrawer = () => setOpenAdd(!OpenAdd)
    return(
        <Grid container spacing={6} >
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Registro de tarifas' sx={{pb:0, '& .MuiCardHeader-title':{letterSpacing:'.15px'}}} />
                    <TableHeader 
                    value={value} 
                    handleFilter={handleFilter} 
                    toggle={toggleDrawer}  
                    placeholder='Busquedad de tarifas'
                    title='Nueva tarifa'
                    disable={isError || isLoading}
                    />
                    {isLoading?<Box sx={{textAlign:'center'}}>Cargando datos...</Box>:!isError?
                    <DataGrid
                    autoHeight
                    rows={data?.data}
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
            <AddDraw open={OpenAdd} toggle={toggleDrawer} title='Registro de Tarifas'>
                <AddTarifas toggle={toggleDrawer}/>
            </AddDraw>
        </Grid>
    )
}
export default Tarifas