import React, { useCallback, useState, MouseEvent, useEffect} from 'react'
import {Box, Card, CardHeader, Grid, IconButton, Typography} from '@mui/material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import {styled} from '@mui/material/styles'
import { DataGrid} from '@mui/x-data-grid'
import TableHeader from 'src/views/apps/minibus/bus/tableHeader'
import Link from 'next/link'
import CustomChip from 'src/@core/components/mui/chip'
import Icon from 'src/@core/components/icon'
import AddUserDrawer from 'src/views/apps/minibus/bus/AddUserDrawer'
import { AppDispatch, RootState } from 'src/store'
import { useSelector, useDispatch } from 'react-redux'
import { fetchData } from 'src/store/apps/bus'
import { deleteBus } from 'src/store/apps/bus'
import getConfig from '../../../configs/environment'

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

type Bus = {
  _id: string | number
  id:string,
  trademark:string,
  model:number,
  type:string,
  plaque:string,
  numberSeating:number,
  fuel:string,
  photo:string,
  status:boolean
}
interface TypeCell {
  row:Bus
}
const RowOptions = ({ id }: { id: number | string }) => {
    // ** Hooks
    const dispatch = useDispatch<AppDispatch>()
  
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
      dispatch(deleteBus(id))
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
        minWidth:200,
        field:'trademark',
        headerName:'Marca',
        renderCell: ({row}:TypeCell)=>{
          return(
            <Box sx={{display:'flex'}}>
              <Box sx={{display:'flex'}}>
                <img src={`${getConfig().backendURI}${row.photo}`} height={45} width={45}></img>
              </Box>
              <Box sx={{display:'flex', paddingTop:3, paddingLeft:1}}>
                <Typography noWrap variant='body2'>
                  {row.trademark}
                </Typography>
              </Box>
            </Box>
          )
        }
    },
    {
        flex:0.2,
        minWidth:90,
        field:'model',
        sortable:false,
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
        minWidth:170,
        field:'type',
        sortable:false,
        headerName:'Tipo',
        renderCell: ({row}:TypeCell)=>{
          return(
          <Typography noWrap variant='body2'>
          {row.type}
        </Typography>
          )
        }
    },
    {
        flex:0.2,
        minWidth:120,
        field:'plaque',
        sortable:false,
        headerName:'Placa',
        renderCell: ({row}:TypeCell)=>{
          return(
          <Typography noWrap variant='body2'>
          {row.plaque}
        </Typography>
          )
        }
    },
    {
      flex:0.2,
      minWidth:90,
      field:'numberSeating',
      headerName:'Cantidad de Asientos',
      renderCell:({row}:TypeCell)=>{
        return(
          <Typography noWrap variant='body2'>
            {row.numberSeating}
          </Typography>
        )
      }
    },
    {
      flex:0.2,
      minWidth:170,
      field:'fuel',
      headerName:'Combustible',
      rederCell: ({row}:TypeCell)=>{
        return(
          <Typography noWrap variant='body2'>
          {row.fuel}
        </Typography>
        )
      }
    },
    {
        flex:0.2,
        minWidth:110,
        field:'status',
        variant:'outlined',
        headerName:'Estado',
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
        minWidth:90,
        field:'actions',
        sortable:false,
        headerName:'Acciones',
        renderCell:({row}:TypeCell)=>{
            return(<RowOptions id={row._id}/>)
        }
    }
]
const Choferes = ()=>{
    const [pageSize,setPageSize]=useState<number>(10)
    const [value, setValue] = useState<string>('')
    const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
    const dispatch = useDispatch<AppDispatch>()
    const store = useSelector((state:RootState)=>state.bus)

    useEffect(()=>{
   dispatch(fetchData())
    },[])

   const rowsData = store.data.map((rows:any,index:any)=>({...rows, id:index+1}))
    const handleFilter = useCallback((val: string) => {
        setValue(val)
      }, [])
      const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)
    return(
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Lista de Microbuses' sx={{pb:4, '& .MuiCardHeader-title':{letterSpacing:'.15px'}}}/>
                    <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />
                    <DataGrid
                    autoHeight
                    rows={rowsData}
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