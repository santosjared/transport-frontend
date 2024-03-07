import React, { useCallback, useState, MouseEvent, useEffect} from 'react'
import {Card, CardHeader, Grid, Hidden, IconButton} from '@mui/material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import {styled} from '@mui/material/styles'
import { DataGrid} from '@mui/x-data-grid'
import TableHeader from 'src/components/tableHeader'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import Icon from 'src/@core/components/icon'
import AddUserDrawer from 'src/views/apps/minibus/choferes/AddUserDrawer'
import axios from 'axios'
import AddDrawMap from 'src/components/addDrawMap'
import Steppers from 'src/components/steppers'
import { useCounter } from 'src/hooks/useCounter'
import Maps from './map'
import Divider from '@mui/material/Divider'


const StyledLink = styled(Link)(({ theme })=>({
    fontWeight: 500,
    fontSize: '0.8rem',
    cursor: 'pointer',
    textDecoration: 'none',
    color: theme.palette.text.secondary,
    '&:hover': {
        color: theme.palette.primary.main
      }
}))

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
          <MenuItem onClick={handleRowOptionsClose} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='mdi:pencil-outline' fontSize={20} color='#00a0f4'/>
            Editar
          </MenuItem>
          <MenuItem onClick={handleRowOptionsClose} sx={{ '& svg': { mr: 2 } }}>
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
        minWidth:110,
        field:'roads',
        headerName:'Rutas'
    },
    {
        flex:0.2,
        minWidth:110,
        field:'date',
        headerName:'Fecha de Creación'
    },
    {
        flex:0.2,
        minWidth:110,
        field:'status',
        variant:'outlined',
        headerName:'Estado'
    },
    {
        flex:0.2,
        minWidth:110,
        field:'actions',
        sortable:false,
        headerName:'Acciones',
        renderCell:()=>{
            return(<RowOptions id={1}/>)
        }
    }
]
const step = [{
  title:'Rutas'
},
{
  title:'Paradas'
}
]
const Roads = ()=>{
    const [pageSize,setPageSize]=useState<number>(10)
    const [value, setValue] = useState<string>('')
    const [hidden, setHidden] = useState<boolean>(false)
    const [rows,setRows] = useState([])
    const handleFilter = useCallback((val: string) => {
        setValue(val)
      }, [])
      const toggleAddUserDrawer = () => setHidden(!hidden)
      useEffect(()=>{
        const fetchData:any = async() =>{
            try{
                const response = await axios.get('http://localhost:3001/drivelicence')
                const rowsData = response.data.map((rows:any,index:any)=>({...rows, id:index+1}))
                setRows(rowsData)
            }catch (error){
                console.error('Error al obtener datos:', error);
            }
        }
        fetchData();
      },[])
      if(!hidden){
    return(
        <Grid container spacing={6} >
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Lista de Rutas' sx={{pb:4, '& .MuiCardHeader-title':{letterSpacing:'.15px'}}}/>
                    <TableHeader 
                    value={value} 
                    handleFilter={handleFilter} 
                    toggle={toggleAddUserDrawer}  
                    placeholder='Busquedad de Rutas'
                    title='Nuevo Rutas'
                    />
                    <DataGrid
                    autoHeight
                    rows={rows}
                    columns={columns}
                    pageSize={pageSize}
                    disableSelectionOnClick
                    rowsPerPageOptions={[10,25,50]}
                    sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
                    onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
                    />
                </Card>
            </Grid>
        </Grid>
    )
  }
  else{
    return(
      <Maps toggle={toggleAddUserDrawer} title='Registrar Rutas'/>
    )
  }
}
export default Roads