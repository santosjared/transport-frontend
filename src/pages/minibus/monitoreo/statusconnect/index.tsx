import { Box, Button, Card, ChipProps, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material"
import getConfig from 'src/configs/environment'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import CustomChip from 'src/@core/components/mui/chip'
import { ChangeEvent, useCallback, useEffect, useState } from "react"
import { DataGrid } from "@mui/x-data-grid"
import { useSocket } from "src/hooks/useSocket"
import { isImage } from "src/utils/verificateImg"
import { format } from 'date-fns';
import FilterListIcon from '@mui/icons-material/FilterList';

interface UserRoleType {
  [key: string]: { icon: string; color: string }
}
const userRoleObj: UserRoleType = {
  administrador: { icon: 'mdi:laptop', color: 'error.main' },
  chofer: { icon: 'healthicons:truck-driver', color: 'success.main' },
  otro: { icon: 'mdi:account-outline', color: 'primary.main' }
}
interface TypeStatus {
  busName: string
  ci: string
  email: string
  lastConnect: Date | null
  linea: string
  photo: string
  plaque: string
  profile: string
  status: string
  userName: string
}
interface TypeCell {
  row: TypeStatus
}
const defaultFilter ={
  busName: '',
  ci: '',
  email: '',
  linea: '',
  plaque: '',
  profile: '',
  status: '',
  userName: ''
}
const renderImg = (row: any) => {

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
const getStatusColor = (Colorstatus: string): ChipProps['color'] => {
  if (Colorstatus === 'connected') {
    return 'success';
  }
  if (Colorstatus === 'signal') {
    return 'warning';
  }
  if (Colorstatus === 'disconnected') {
    return 'error';
  }
  return 'info';
};

const renderClient = (row: any) => {
  const [isImg, setIsImg] = useState<any>(false)
  useEffect(() => {
    const image = async () => {
      const img = await isImage(`${getConfig().backendURI}${row.profile}`)
      setIsImg(img)
    }
    image()
  }, [row.profile])
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

const RenderStatus = (row: any) => {
  if (row.status === 'connected') {
    return 'en linea'
  }
  if (row.status === 'signal') {
    return 'baja señal'
  }
  if (row.status === 'disconnected') {
    return 'Desconectado'
  }
}
const getLastconnect = (date: any) => {
  if (date) {
    const hour = getHours(date)
    const day = getDay(date)
    return `últ. vez ${day} a las ${hour}`
  }
  return 'últ. vez nunca se conectó'
}
const getHours = (date: any): string => {
  const parsedDate = new Date(date);
  const hours = parsedDate.getHours();
  const minutes = parsedDate.getMinutes();
  if (minutes < 10) {
    return `${hours}:0${minutes}`
  }
  return `${hours}:${minutes}`
}
const getDay = (date: any) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

  const targetDate = new Date(date);

  if (targetDate.toDateString() === today.toDateString()) {
    return 'hoy';
  }
  if (targetDate.toDateString() === yesterday.toDateString()) {
    return 'ayer';
  }
  return format(new Date(date), 'dd/MM/yyyy')
}
const columns = [
  {
    flex: 0.2,
    minWidth: 230,
    field: 'user',
    headerName: 'Usuarios',
    renderCell: ({ row }: TypeCell) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: theme => `${theme.palette.text.secondary}` }}>{`${row.userName}`}</Typography>
            <Typography noWrap variant='caption'>
              {row.email}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 80,
    field: 'ci',
    headerName: 'Ci',
    renderCell: ({ row }: TypeCell) => {
      return (
        <Typography variant="body2">{row.ci}</Typography>
      )
    }
  },
  {
    flex: 0.2,
    field: 'bus',
    minWidth: 180,
    headerName: 'bus',
    renderCell: ({ row }: TypeCell) => {
      return (
        <Box sx={{ display: 'flex' }}>
          {renderImg(row)}
          <Box sx={{ display: 'flex', paddingTop: 2, paddingLeft: 1 }}>
            <Typography noWrap variant='body2'>
              {row.busName ? row.busName: 'Ninguno'}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 80,
    field: 'plaque',
    headerName: 'Placa',
    renderCell: ({ row }: TypeCell) => {
      return (
        <Typography variant="body2">{row.plaque?row.plaque:'___'}</Typography>
      )
    }
  },
  {
    flex: 0.2,
    field: 'linea',
    minWidth: 80,
    headerName: 'Linea',
    renderCell: ({ row }: TypeCell) => {
      return (
        <Typography noWrap variant="body2">
          {row.linea ? row.linea : 'Ninguno'}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 250,
    field: 'status',
    headerName: 'Estado de conexion',
    renderCell: ({ row }: TypeCell) => {
      return (
        <Box><CustomChip
          skin='light'
          size='small'
          label={RenderStatus(row)}
          color={getStatusColor(row.status)}
          sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
        />
          {row.status === 'disconnected' ? <Typography noWrap variant="body2">{getLastconnect(row.lastConnect)}</Typography> : ''}
        </Box>
      )
    }
  },
]

const ListStatusConnect = () => {
  const [pageSize, setPageSize] = useState<number>(10)
  const [page,setPage] = useState<number>(0)
  const [users, setUsers] = useState<any[]>([])
  const [openfilters, setOpenFilters] = useState(false)
  const [total,setTotal] = useState(0)
  const [filters,setFilters] = useState(defaultFilter)

  const { socket, isConnected, connect } = useSocket();
  const toggleFilter = () => setOpenFilters(!openfilters)
  useEffect(()=>{
    if(!isConnected){
      connect()
    }
    socket?.emit('linea',{ filter:'', skip:page*pageSize, limit:pageSize })
  },[page, pageSize])
  useEffect(() => {
    socket?.on('updateStatus', (data) => {
      setUsers(data.result)
      setTotal(data.total)
    })
  }, [])
  const handleChangeFields = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters({
        ...filters,
        [name]: value
    })
}
const handleChangeSelects = (e: SelectChangeEvent) => {
  const { name, value } = e.target
  setFilters({
      ...filters,
      [name]: value
  })
}
const handleFilters = () =>{
  if(!isConnected){
    connect()
  }
  socket?.emit('linea',{ filter:filters, skip:page*pageSize, limit:pageSize })
}
const handleReset = () =>{
  if(!isConnected){
    connect()
  }
  socket?.emit('linea',{filter:'',skip:page*pageSize, limit:pageSize})
  setFilters(defaultFilter)
}
  return (
    <Box>
      <Box sx={{ pt: 5, pl: 5, pr: 5, pb: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <Button variant="contained" sx={{ height: 43 }} onClick={toggleFilter}>
          {openfilters ? 'Cerrar filtrado' : 'Filtrar por columnas'}
        </Button>
        <FormControl sx={{ mb: 1, display: { xs: 'none', sm: 'block', lg: 'block' } }}>
          <Box sx={{border:'1px solid #E0E0E0', padding:1, borderRadius:0.5}}>
            <Typography variant="body2">url para conectar: {`${getConfig().backendURI}`} </Typography>
          </Box>
        </FormControl>
      </Box>
      {openfilters ? <Box sx={{ pt: 0, pl: 5, pr: 5, pb: 3 }}>
        <Card sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <FormControl fullWidth sx={{ mb: 1 }}>
                <TextField label='Usuarios'
                  variant='standard'
                  name="userName"
                  fullWidth
                  autoComplete='off'
                  value={filters.userName}
                  onChange={handleChangeFields}
                  InputProps={{
                    startAdornment: <FilterListIcon />,
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <FormControl fullWidth sx={{ mb: 1 }}>
                <TextField label='Ci'
                  variant='standard'
                  name="ci"
                  fullWidth
                  value={filters.ci}
                  onChange={handleChangeFields}
                  autoComplete='off'
                  InputProps={{
                    startAdornment: <FilterListIcon />,
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <FormControl fullWidth sx={{ mb: 1 }}>
                <TextField label='Bus'
                  variant='standard'
                  fullWidth
                  name="busName"
                  value={filters.busName}
                  onChange={handleChangeFields}
                  autoComplete='off'
                  InputProps={{
                    startAdornment: <FilterListIcon />,
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <FormControl fullWidth sx={{ mb: 1 }}>
                <TextField label='Placa'
                  variant='standard'
                  fullWidth
                  name="plaque"
                  value={filters.plaque}
                  onChange={handleChangeFields}
                  autoComplete='off'
                  InputProps={{
                    startAdornment: <FilterListIcon />,
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <FormControl fullWidth sx={{ mb: 1 }}>
                <TextField label='Linea'
                  variant='standard'
                  fullWidth
                  name="linea"
                  value={filters.linea}
                  onChange={handleChangeFields}
                  autoComplete='off'
                  InputProps={{
                    startAdornment: <FilterListIcon />,
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <FormControl fullWidth sx={{ mb: 1 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Estado de conexion</InputLabel>
                  <Select
                    variant="standard"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="status"
                    value={filters.status}
                    onChange={handleChangeSelects}
                    label="Age"
                  >
                    <MenuItem value='connected'>Conectado</MenuItem>
                    <MenuItem value='disconnected'>Desconectado</MenuItem>
                    <MenuItem value='signal'>Baja señal</MenuItem>
                  </Select>
                </FormControl>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Button variant="contained" sx={{ mr: 3 }} onClick={handleFilters}>Filtrar</Button>
                <Button variant="outlined" onClick={handleReset}>Restablecer</Button>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Box> : ''}
      <DataGrid
        autoHeight
        rows={users}
        columns={columns}
        pagination
        pageSize={pageSize}
        disableSelectionOnClick
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[10, 25, 50]}
        rowCount={total}
        paginationMode="server"
        onPageChange={(newPage) => setPage(newPage)}
        sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
      />
    </Box>
  )
}
export default ListStatusConnect
