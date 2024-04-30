import React, { useCallback, useState, MouseEvent} from 'react'
import { Avatar, Box, Button, Card, CardHeader, Grid, IconButton, Typography} from '@mui/material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import {styled} from '@mui/material/styles'
import { DataGrid} from '@mui/x-data-grid'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import Icon from 'src/@core/components/icon'
import AddDraw from 'src/components/addDraw'
import AddChofer from './register'
import TableHeader from 'src/components/tableHeader'
import { useService } from 'src/hooks/useService'
import { useQuery } from 'react-query'
import getConfig from 'src/configs/environment'
import CustomChip from 'src/@core/components/mui/chip'

interface usersData {
  name:string;
  lastName:string;
  ci:string;
  address:string;
  phone:string;
  gender:string;
  contry:string;
  city:string
  profile:string;
  status:boolean;
}
interface RowsTypeCell {
  row:usersData
}
const RowOptions = ({ id }: { id: number | string }) => {
    // ** Hooks
    //const dispatch = useDispatch<AppDispatch>()
  
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
      //dispatch(deleteUser(id))
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
            <Icon icon='la:clipboard-check' fontSize={20} color='#00a0f4'/>
            Asignar minibus
          </MenuItem>
          <MenuItem onClick={handleRowOptionsClose} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='mdi:pencil-outline' fontSize={20} color='#00a0f4'/>
            ver licence
          </MenuItem>
        </Menu>
      </>
    )
  }
  
const columns = [
    {
        flex:0.2,
        minWidth:200,
        field:'fullName',
        headerName:'Nombres y Apellidos',
        renderCell:({row}:RowsTypeCell)=>{
          return(
          <Box sx={{display:'flex', justifyContent:'space-between'}}>
            <Avatar alt='profile' src={`${getConfig().backendURI}${row.profile}`} sx={{border:'solid 1px #E0E0E0'}}/>
            <Typography variant='body2' sx={{margin:2}}>{`${row.name} ${row.lastName}`}</Typography>
          </Box>)
        }
    },
    {
        flex:0.2,
        minWidth:90,
        field:'ci',
        sortable:false,
        headerName:'CI',
        renderCell:({row}:RowsTypeCell)=>{
          return(
            <Typography variant='body2' noWrap>{row.ci}</Typography>
          )
        }
    },
    {
        flex:0.2,
        minWidth:90,
        field:'address',
        sortable:false,
        headerName:'Dirección',
        renderCell:({row}:RowsTypeCell)=>{
          return(
            <Typography  variant='body2' noWrap>{row.address}</Typography>
          )
        }
    },
    {
        flex:0.2,
        minWidth:90,
        field:'phone',
        sortable:false,
        headerName:'Celular',
        renderCell:({row}:RowsTypeCell)=>{
          return(
            <Typography noWrap variant='body2'>{row.phone}</Typography>
          )
        }
    },
    {
        flex:0.2,
        minWidth:90,
        field:'gender',
        sortable:false,
        headerName:'Género',
        renderCell:({row}:RowsTypeCell)=>{
          return(
            <Typography noWrap variant='body2'>{row.gender}</Typography>
          )
        }
    },
    {
        flex:0.2,
        minWidth:90,
        field:'contry',
        sortable:false,
        headerName:'Nacionalidad',
        renderCell:({row}:RowsTypeCell)=>{
          return(
            <Typography noWrap variant='body2'>{row.contry}</Typography>
          )
        }
    },
    {
      flex:0.2,
      minWidth:90,
      field:'city',
      sortable:false,
      headerName:'Localidad',
      renderCell:({row}:RowsTypeCell)=>{
        return(
          <Typography noWrap variant='body2'>{row.city}</Typography>
        )
      }
    },
    {
        flex:0.2,
        minWidth:90,
        field:'status',
        variant:'outlined',
        headerName:'Estados',
        renderCell: ({ row }: RowsTypeCell) => {
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
        minWidth:90,
        field:'actions',
        sortable:false,
        headerName:'Acciones',
        renderCell:()=>{
            return(<RowOptions id={1}/>)
        }
    }
]
const Users = ()=>{
    const [pageSize,setPageSize]=useState<number>(10)
    const [value, setValue] = useState<string>('')
    const [drawOpen, setDrawOpen] = useState<boolean>(false)
    const handleFilter = useCallback((val: string) => {
        setValue(val)
      }, [])
    
    const {Get} = useService()  
    const {data, isLoading, isError} = useQuery('users',()=>Get('/users'))
      const toggleDrawer = () => setDrawOpen(!drawOpen)
    return(
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
                        disable={false}
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
            <AddDraw open={drawOpen} toggle={toggleDrawer} title='Registro de la chofer'>
                <AddChofer toggle={toggleDrawer} />
            </AddDraw>
        </Grid>
    )
}
export default Users