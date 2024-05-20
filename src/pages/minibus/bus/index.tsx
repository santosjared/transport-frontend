import React, { useCallback, useState, MouseEvent, useEffect } from 'react'
import { Box, Card, CardHeader, Grid, IconButton, TextField, Typography } from '@mui/material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import { DataGrid } from '@mui/x-data-grid'
import Link from 'next/link'
import CustomChip from 'src/@core/components/mui/chip'
import Icon from 'src/@core/components/icon'
import AddUserDrawer from 'src/views/apps/minibus/bus/AddUserDrawer'
import { AppDispatch, RootState } from 'src/store'
import { useSelector, useDispatch } from 'react-redux'
import { deleteBus, fetchData } from 'src/store/apps/bus'
import getConfig from '../../../configs/environment'
import AddDraw from 'src/components/addDraw'
import RegisterBus from './register'
import TableHeader from 'src/components/tableHeader'
import { useQuery } from 'react-query'
import { useService } from 'src/hooks/useService'
import DialogUsers from './Dialog'
import { isImage } from 'src/utils/verificateImg'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'

interface UsersType {
  name: string;
  lastName: string;
  ci: string;
  address: string;
  phone: string;
  gender: string;
  contry: string;
  email: string
  profile: string;
  rol: [];
}
type Bus = {
  id: string,
  trademark: string,
  model: number,
  type: string,
  plaque: string,
  cantidad: number,
  gps: string,
  photo: string,
  status: boolean
  userId:UsersType
}
interface TypeCell {
  row: Bus
}
const renderClient = (row: UsersType) => {
  const [isImg,setIsImg] = useState<any>(false)
  useEffect(()=>{
    const image = async()=>{
      const img = await isImage(`${getConfig().backendURI}${row.profile}`)
      setIsImg(img)
    }
    image()
  },[row.profile])
  if (isImg) {
    return <CustomAvatar src={`${getConfig().backendURI}${row.profile}`} sx={{ mr: 3, width: 34, height: 34 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color='primary'
        sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}
      >
        {getInitials(row.name && row.lastName ? `${row.name} ${row.lastName}` : row.name ? row.name : 'Desconocido')}
      </CustomAvatar>
    )
  }
}
const renderImg = (row: Bus) => {

  const [isImg, setIsImg] = useState<any>(false)
  useEffect(() => {
    const image = async () => {
      const img = await isImage(`${getConfig().backendURI}${row.photo}`)
      setIsImg(img)
    }
    image()
  }, [row.photo])
  if (isImg) {
    return (
      <Box sx={{ display: 'flex', border: 'solid 1px #E0E0E0', borderRadius: 0.5 }}>
      <img src={`${getConfig().backendURI}${row.photo}`} height={35} width={35} style={{ borderRadius: 5 }}></img>
    </Box>
    )
  } else {
    return ''
  }

}
const Bus = () => {
  const RowOptions = ({ id }: { id: number | string }) => {
    const dispatch = useDispatch<AppDispatch>()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const rowOptionsOpen = Boolean(anchorEl)

    const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget)
    }
    const handleRowOptionsClose = () => {
      setAnchorEl(null)
    }
    const handleUsersClick = () => {
      // DrawUser();
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
            sx={{ '& svg': { mr: 2 } }}
            onClick={handleUsersClick}
          >
            <Icon icon='healthicons:truck-driver' fontSize={20} color='#00a0f4' />
            Asignar Chofer
          </MenuItem>
          <MenuItem onClick={handleRowOptionsClose} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='mdi:pencil-outline' fontSize={20} color='#00a0f4' />
            Editar
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='mdi-light:delete' fontSize={20} color=' #f52b00 ' />
            Eliminar
          </MenuItem>
        </Menu>
      </>
    )
  }
  const columns = [
    {
      flex: 0.2,
      minWidth: 230,
      field: 'trademark',
      headerName: 'Marca',
      renderCell: ({ row }: TypeCell) => {
        return (
          <Box sx={{ display: 'flex' }}>
            {renderImg(row)}
            <Box sx={{ display: 'flex', paddingTop: 2, paddingLeft: 1 }}>
              <Typography noWrap variant='body2'>
                {row.trademark}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 90,
      field: 'model',
      sortable: false,
      headerName: 'Modelo',
      renderCell: ({ row }: TypeCell) => {
        return (
          <Typography noWrap variant='body2'>
            {row.model}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 90,
      field: 'type',
      sortable: false,
      headerName: 'Tipo',
      renderCell: ({ row }: TypeCell) => {
        return (
          <Typography noWrap variant='body2'>
            {row.type}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 90,
      field: 'plaque',
      sortable: false,
      headerName: 'Placa',
      renderCell: ({ row }: TypeCell) => {
        return (
          <Typography noWrap variant='body2'>
            {row.plaque}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 90,
      field: 'cantidad',
      headerName: 'Cantidad A.',
      renderCell: ({ row }: TypeCell) => {
        return (
          <Typography noWrap variant='body2'>
            {row.cantidad}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 230,
      field: 'chofer',
      headerName: 'Chofer',
      renderCell: ({ row }: TypeCell) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {row.userId?  <>{renderClient(row.userId)}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: theme => `${theme.palette.text.secondary}` }}>{`${row.userId.name} ${row.userId.lastName}`}</Typography>
            <Typography noWrap variant='caption'>
              {row.userId.ci}
            </Typography>
          </Box></>:<Typography noWrap variant='body2'>No asignado</Typography>}
        </Box>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 80,
      field: 'status',
      variant: 'outlined',
      headerName: 'Estado',
      renderCell: ({ row }: TypeCell) => {
        return (
          <CustomChip
            skin='light'
            size='small'
            label={row.status ? 'Activo' : 'Inactivo'}
            color={row.status ? 'success' : 'secondary'}
            sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
          />
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 80,
      field: 'actions',
      sortable: false,
      headerName: 'Acciones',
      renderCell: ({ row }: TypeCell) => {
        return (<RowOptions id={row.id} />)
      }
    }
  ]
  const [pageSize, setPageSize] = useState<number>(10)
  const [pageNumber, setPageNumber] = useState(0);
  const [value, setValue] = useState<string>('')
  const [draw, setDraw] = useState<boolean>(false)
  const [openUsers, setOpenUsers] = useState(false)
  const [idBus, setIdBus] = useState<number | string>('')
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.bus)
  useEffect(() => {
    dispatch(fetchData({filter:'',skip:pageNumber,limit:pageSize}))
  }, [dispatch,pageSize,pageNumber])
  
  const handleFilter = useCallback((val: string) => {
    dispatch(fetchData({filter:val}))
    setValue(val)
  }, [])
  const toggleDrawer = () => setDraw(!draw)
  const DrawUser = () => setOpenUsers(!openUsers)
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Lista de Microbuses' sx={{ pb: 4, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            toggle={toggleDrawer}
            placeholder='Busquedad de microbuses'
            title='Nuevo microbus'
          />
          {store.isLoading ? <Box sx={{ textAlign: 'center' }}>Cargando datos...</Box> : !store.isError ?
            <DataGrid
              autoHeight
              rows={store.data}
              columns={columns}
              pageSize={pageSize}
              rowCount={store.total}
              disableSelectionOnClick
              rowsPerPageOptions={[10, 25, 50]}
              sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
              onPageChange={(newPageNumber) => setPageNumber(newPageNumber)}
              onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
            /> : ''
          }
        </Card>
      </Grid>
      <AddDraw open={draw} toggle={toggleDrawer} title='Registro de Horarios'>
        <RegisterBus toggle={toggleDrawer} />
      </AddDraw>
      <DialogUsers open={openUsers} toggle={DrawUser} id={idBus} />
    </Grid>
  )
}
export default Bus