import React, { useCallback, useState, MouseEvent, useEffect, useMemo} from 'react'
import {Box, Button, Card, CardHeader, Grid, Hidden, IconButton, Typography} from '@mui/material'
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
import { useService } from 'src/hooks/useService'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import type { FeatureCollection } from 'geojson';
import CustomChip from 'src/@core/components/mui/chip'
import Swal from 'sweetalert2'
import { format } from 'date-fns';
import ViewMap from './viewMap'

interface RoadData {
  createdAt:string
  name:string
  status:boolean
  id:string
}

interface TypeCell {
  row:RoadData
}

const columns = [
  {
      flex:0.2,
      minWidth:110,
      field:'name',
      headerName:'Nombres de rutas',
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
      minWidth:110,
      field:'createdAt',
      headerName:'Fecha de Creación',
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
    minWidth:110,
    field:'road',
    headerName:'Rutas',
    renderCell:({row}:TypeCell)=>{
      return(
        <Typography noWrap variant='body2'>
          <Button variant='outlined' sx={{textTransform:'lowercase'}} href='/minibus/road/view/rutas/'>ver rutas</Button>
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
      minWidth:110,
      field:'actions',
      sortable:false,
      headerName:'Acciones',
      renderCell:({row}:TypeCell)=>{
          return(<RowOptions id={row.id}/>)
      }
  }
]

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
  
const Roads = ()=>{
  
    const [pageSize,setPageSize]=useState<number>(10)
    const [value, setValue] = useState<string>('')
    const [hidden, setHidden] = useState<boolean>(false)
    const {Get}=useService()
    const {data,isLoading,isError} = useQuery('roads',()=>Get('/road'))
    const handleFilter = useCallback((val: string) => {
        setValue(val)
      }, [])
      const toggleDrawer = () => setHidden(!hidden)
      useEffect(()=>{
        if(isError)
        {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text:'Hubo un error al obtener los datos, conexion de base de datos fallida o variables de entorno no son correctos',
          });
        }
      },[isError])
      if(!hidden){
    return(
        <Grid container spacing={6} >
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Registro de rutas' sx={{pb:0, '& .MuiCardHeader-title':{letterSpacing:'.15px'}}} />
                    <TableHeader 
                    value={value} 
                    handleFilter={handleFilter} 
                    toggle={toggleDrawer}  
                    placeholder='Busquedad de lineas'
                    title='Nuevo Rutas'
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
        </Grid>
    )
  }
  else{
    return(
      <Maps toggle={toggleDrawer} title='Registrar Rutas'/>
    )
  }
}

export default Roads