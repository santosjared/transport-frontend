import React, { useCallback, useState, MouseEvent} from 'react'
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
        field:'address',
        sortable:false,
        headerName:'Dirección',
    },
    {
        flex:0.2,
        minWidth:230,
        field:'phone',
        sortable:false,
        headerName:'Celular',
    },
    {
        flex:0.2,
        minWidth:230,
        field:'email',
        sortable:false,
        headerName:'Email',
    },
    {
        flex:0.2,
        minWidth:230,
        field:'contry',
        sortable:false,
        headerName:'Nacionalidad',
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
const rows = [
    {id:1, fullName:'user', CI:'10765634',address:'Av. San Clemente',phone:'72381722',email:'user@gmail.com',contry:'Bolivia',status:'Active',actions:'editar'},

]
const Choferes = ()=>{
    const [pageSize,setPageSize]=useState<number>(10)
    const [value, setValue] = useState<string>('')
    const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
    const handleFilter = useCallback((val: string) => {
        setValue(val)
      }, [])
      const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)
    return(
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Lista de Choferes' sx={{pb:4, '& .MuiCardHeader-title':{letterSpacing:'.15px'}}}/>
                    {/* <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} /> */}
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
            {/* <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} /> */}
        </Grid>
    )
}
export default Choferes