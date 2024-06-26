import React, { useCallback, useState, MouseEvent, useEffect} from 'react'
import { Box, Button, Card, CardHeader, Grid, IconButton, Typography} from '@mui/material'
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
import { format } from 'date-fns'
import CustomChip from 'src/@core/components/mui/chip'

interface ChoferesData {
  id:string
  userId:string
  category:string
  dateEmition:string
  dateExpire:string
  status:boolean
}
interface TypeCell {
  row:ChoferesData
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

  const Names = ({id}:{id:number | string}) =>{

    const [data, setData] = useState<{ name: string, lastName:string }>({ name: '', lastName:'' })

    const { GetId } = useService()

    useEffect(() => {
        const fetchData = async () => {
            const fetch = await GetId('/users', id)
            setData(fetch.data)
        }
        fetchData()
    }, [id])
    return (<Typography noWrap variant='body2'>{`${data.name} ${data.lastName}`}</Typography>)
  }
  const RenderCi = ({id}:{id:number | string}) =>{

    const [data, setData] = useState<{ ci:string }>({ ci: ''})

    const { GetId } = useService()

    useEffect(() => {
        const fetchData = async () => {
            const fetch = await GetId('/users', id)
            setData(fetch.data)
        }
        fetchData()
    }, [id])
    return (<Typography noWrap variant='body2'>{data.ci}</Typography>)
  }
const columns = [
    {
        flex:0.2,
        minWidth:200,
        field:'fullName',
        headerName:'Nombres y Apellidos',
        renderCell:({row}:TypeCell)=>{
          return(
            <Names id={row.userId}/>
          )
        }
    },
    {
        flex:0.2,
        minWidth:80,
        field:'ci',
        sortable:false,
        headerName:'CI',
        renderCell:({row}:TypeCell)=>{
          return(<RenderCi id={row.userId}/>)
        }
    },
    {
        flex:0.2,
        minWidth:50,
        field:'category',
        sortable:false,
        headerName:'Categoría de licencia',
        renderCell:({row}:TypeCell) =>{
          return(
            <Typography noWrap variant='body2'>{row.category}</Typography>
          )
        }
    },
    {
        flex:0.2,
        minWidth:90,
        field:'dateEmition',
        sortable:false,
        headerName:'Fecha de Emision',
        renderCell:({row}:TypeCell)=>{
          return(
            <Typography noWrap variant='body2'>{format(new Date(row.dateEmition), 'dd/MM/yyyy')}</Typography>
          )
        }
    },
    {
        flex:0.2,
        minWidth:90,
        field:'dateExpire',
        sortable:false,
        headerName:'Fecha de expiración',
        renderCell:({row}:TypeCell)=>{
          return(
            <Typography noWrap variant='body2'>{format(new Date(row.dateExpire), 'dd/MM/yyyy')}</Typography>
          )
        }
    },
    {
        flex:0.2,
        minWidth:90,
        field:'status',
        variant:'outlined',
        headerName:'Estado',
        renderCell:({row}:TypeCell)=>{
          return(
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

const Choferes = ()=>{
    const [pageSize,setPageSize]=useState<number>(10)
    const [value, setValue] = useState<string>('')
    const [drawOpen, setDrawOpen] = useState<boolean>(false)
    
    const {Get} = useService()
    const {data, isLoading, isError} = useQuery('choferes',()=>Get('/choferes'))
    const handleFilter = useCallback((val: string) => {
        setValue(val)
      }, [])
      const toggleDrawer = () => setDrawOpen(!drawOpen)
    return(
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Card>
                <CardHeader title='Registro de choferes' sx={{ pb: 0, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
                    <TableHeader
                        value={value}
                        handleFilter={handleFilter}
                        toggle={toggleDrawer}
                        placeholder='Busquedad de choferes'
                        title='Nueva licencia de conducir'
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
            <AddDraw open={drawOpen} toggle={toggleDrawer} title='Registro de la linea'>
                <AddChofer toggle={toggleDrawer} />
            </AddDraw>
        </Grid>
    )
}
export default Choferes