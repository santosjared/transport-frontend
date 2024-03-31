import React, { useCallback, useState, MouseEvent, useEffect} from 'react'
import { Button, Card, CardHeader, Grid, IconButton} from '@mui/material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import {styled} from '@mui/material/styles'
import { DataGrid} from '@mui/x-data-grid'
import TableHeader from 'src/views/apps/minibus/choferes/tableHeader'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import Icon from 'src/@core/components/icon'
import AddUserDrawer from 'src/views/apps/minibus/choferes/AddUserDrawer'
import axios from 'axios'


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
        minWidth:230,
        field:'fullName',
        headerName:'Nombres y Apellidos'
    },
    {
        flex:0.2,
        minWidth:230,
        field:'CI',
        sortable:false,
        headerName:'CI',
    },
    {
        flex:0.2,
        minWidth:230,
        field:'numberLicence',
        sortable:false,
        headerName:'Nro de Licencia',
    },
    {
        flex:0.2,
        minWidth:230,
        field:'category',
        sortable:false,
        headerName:'Categoría',
    },
    {
        flex:0.2,
        minWidth:230,
        field:'emition',
        sortable:false,
        headerName:'Fecha de Emisión',
    },
    {
        flex:0.2,
        minWidth:230,
        field:'expiration',
        sortable:false,
        headerName:'Fecha de Expiración',
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
        minWidth:90,
        field:'actions',
        sortable:false,
        headerName:'Acciones',
        renderCell:()=>{
            return(<RowOptions id={1}/>)
        }
    }
]
const Choferes = ()=>{
    const [pageSize,setPageSize]=useState<number>(10)
    const [value, setValue] = useState<string>('')
    const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
    const [rows,setRows] = useState([])
    const handleFilter = useCallback((val: string) => {
        setValue(val)
      }, [])
      const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)
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
    return(
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Lista de Choferes' sx={{pb:4, '& .MuiCardHeader-title':{letterSpacing:'.15px'}}}/>
                    <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />
                    <DataGrid
                    autoHeight
                    rows={rows}
                    columns={columns}
                    //checkboxSelection
                    pageSize={pageSize}
                    disableSelectionOnClick
                    rowsPerPageOptions={[10,25,50]}
                    sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
                    onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
                    />
                </Card>
            </Grid>
            <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
        </Grid>
    )
}
export default Choferes