import React, { useCallback, useState, MouseEvent} from 'react'
import { Button, Card, CardHeader, Grid, IconButton} from '@mui/material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import {styled} from '@mui/material/styles'
import { DataGrid} from '@mui/x-data-grid'
import TableHeader from 'src/views/apps/minibus/firts/tableHeader'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import Icon from 'src/@core/components/icon'


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
            Asignar
          </MenuItem>
          <MenuItem onClick={handleRowOptionsClose} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='mdi:pencil-outline' fontSize={20} color='#00a0f4'/>
            Editar
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='mdi:delete-outline' fontSize={20} color='#ff3b1f'/>
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
        field:'horasI',
        headerName:'Hora de Partida'
    },
    {
        flex:0.2,
        minWidth:230,
        field:'Partida',
        headerName:'Ruta Partida',
    },
    {
        flex:0.2,
        minWidth:230,
        field:'horasFin',
        headerName:'Hora de Llegada'
    },
    {
        flex:0.2,
        minWidth:110,
        field:'Fin',
        headerName:'Ruta de llegada'
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
    {id:1, horasI:'08:00', Partida:'Av. Las Banderas',horasFin:'10:00',Fin:'Plaza Minero',actions:'editar'},
    {id:2, horasI:'08:10', Partida:'Av. Las Banderas',horasFin:'10:10',Fin:'Plaza Minero',actions:'editar'},
    {id:3, horasI:'08:20', Partida:'Av. Las Banderas',horasFin:'10:20',Fin:'Plaza Minero',actions:'editar'},
    {id:4, horasI:'08:30', Partida:'Av. Las Banderas',horasFin:'10:30',Fin:'Plaza Minero',actions:'editar'},
    {id:5, horasI:'08:40', Partida:'Av. Las Banderas',horasFin:'10:40',Fin:'Plaza Minero',actions:'editar'},

]
const Firts = ()=>{
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
                    <CardHeader title='Lista de Horario Diario' sx={{pb:4, '& .MuiCardHeader-title':{letterSpacing:'.15px'}}}/>
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
        </Grid>
    )
}
export default Firts