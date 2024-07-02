import React, { SyntheticEvent, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Link from '@mui/material/Link'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Dialog from '@mui/material/Dialog'
import Tooltip from '@mui/material/Tooltip'
import Checkbox from '@mui/material/Checkbox'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import DialogTitle from '@mui/material/DialogTitle'
import AvatarGroup from '@mui/material/AvatarGroup'
import CardContent from '@mui/material/CardContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import TableContainer from '@mui/material/TableContainer'
import FormControlLabel from '@mui/material/FormControlLabel'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useDispatch } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { useSelector } from 'react-redux'
import { addRol, deleteRol, fetchData } from 'src/store/apps/rol'
import getConfig from 'src/configs/environment'
import { useService } from 'src/hooks/useService'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Menu, MenuItem } from '@mui/material'
import UsersNotRol from './users'
import UsersRol from './usersrol'
import AddRol from './addRol'
import EditRol from './editRol'
import { deleteLinea } from 'src/store/apps/linea'
import Swal from 'sweetalert2'

const RolesCards = () => {
  // ** States
  const [anchorEl, setAnchorEl] = useState(null);
  const [openNotrolUser, setOpenNotuser] = useState(false)
  const [rolId,SetRolId] = useState<string>('')
  const [openDesasigned, setOpenDesasigned] = useState(false)
  const [rol,setRol] = useState<any>(null)
  const [openEdit,setOpenEdit] = useState(false)
  const [rules,setRules] = useState<string[]>([])

  const [openAdd,setOpenAdd] = useState(false)
  const openAnchor = Boolean(anchorEl);

  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.rol)

  const toggleUsers = ()=>setOpenNotuser(!openNotrolUser)
  const toggleDesasigned = () =>setOpenDesasigned(!openDesasigned)
  const toggleAdd = () => setOpenAdd(!openAdd)
  const toggleEdit = () => setOpenEdit(!openEdit)

  useEffect(() => {
    dispatch(fetchData())
  }, [dispatch])

  const {Get} = useService()
  useEffect(() => {
    const fetch = async () => {
      const response = await Get('/auth')
      if (response.data && response.data.access) {
        setRules(response.data.access)
      }
    }
    fetch()
  }, [])

  const handleCloseAnchor = () => {
    setAnchorEl(null);
  };

  const handleClick = (event:any) => {
    setAnchorEl(event.currentTarget);
  };
  const AsignedRol = (id:string)=>{
    SetRolId(id)
    toggleUsers()
  }
  const desasignedRol=(data:any)=>{
    setRol(data)
    toggleDesasigned()
  }

  const handleEdit = (data:any) =>{
    setRol(data)
    toggleEdit()
    handleCloseAnchor()
  }

  const handleDelet = async (rol:any) =>{
    handleCloseAnchor()
    if(rol.Users.length !== 0){
      Swal.fire({title:'Error!', text:'Primero quite usuarios del rol', icon:'warning'})
      return
    }
    const confirme = await Swal.fire({
      title: '¿Estas seguro de eliminar?',
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#3085d6",
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ff4040',
      confirmButtonText: 'Eliminar',
    }).then(async (result) => { return await result.isConfirmed });
    if (confirme) {
      dispatch(deleteRol(rol.id)).then((result) => {
        if (result.payload) {
          Swal.fire({
            title: '¡Éxito!',
            text: 'Los datos fueron eliminados',
            icon: "success"
          });
        }
      })
    }
  }
  const renderCards = () =>
    store.data.map((rol: any, index: number) => (
      <Grid item xs={12} sm={6} lg={4} key={index}>
        <Card>
          <CardContent>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2">{`Total ${rol.Users.length} users`}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AvatarGroup
                  max={4}
                  sx={{
                    '& .MuiAvatar-root': {
                      width: 40,
                      height: 40,
                      fontSize: '0.875rem',
                      marginRight: '-8px' // Ajusta este valor según el espacio que desees
                    }
                  }}
                >
                  {rol.Users.map((user: any, index: number) => (
                    <Avatar key={index} alt={user.name} src={`${getConfig().backendURI}${user.profile}`} />
                  ))}
                </AvatarGroup>
                <IconButton
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={handleClick}
                  sx={{ marginLeft: '3px' }} // Ajusta este valor según el espacio que desees
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id="long-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={openAnchor}
                  onClose={handleCloseAnchor}
                >
                  {rules.some((rule:any) => rule.name === 'Editar-rol')&&
                  <MenuItem onClick={()=>handleEdit(rol)}>Editar</MenuItem>}
                  {rules.some((rule:any) => rule.name === 'Eliminar-rol')&&<MenuItem onClick={()=>handleDelet(rol)}>Eliminar</MenuItem>}
                </Menu>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='h6'>{rol.name}</Typography>
                {rules.some((rule:any) => rule.name === 'Agregar-rol')&&<Typography
                  href='/'
                  variant='body2'
                  component={Link}
                  sx={{ color: 'primary.main' }}
                  onClick={(e: SyntheticEvent) => {
                    e.preventDefault()
                    AsignedRol(rol._id)
                  }}
                >
                  Agregar usuarios
                </Typography>}
              </Box>

              {rules.some((rule:any) => rule.name === 'Quitar-rol')&&<Typography
                href='/'
                variant='body2'
                component={Link}
                sx={{ color: 'primary.main' }}
                onClick={(e: SyntheticEvent) => {
                  e.preventDefault()
                  desasignedRol(rol)
                }}
              >
                Quitar usuarios
              </Typography>}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ))

  return (
    <Grid container spacing={6} className='match-height'>
      {renderCards()}
      {rules.some((rule:any) => rule.name === 'Crear-rol')&&
      <Grid item xs={12} sm={6} lg={4}>
        <Card
          sx={{ cursor: 'pointer' }}
          onClick={() => {
            toggleAdd()
          }}
        >
          <Grid container sx={{ height: '100%' }}>
            <Grid item xs={5}>
              <Box sx={{ height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                <img width={65} height={130} alt='add-role' src='/images/pages/add-new-role-illustration.png' />
              </Box>
            </Grid>
            <Grid item xs={7}>
              <CardContent>
                <Box sx={{ textAlign: 'right' }}>
                  <Button
                    variant='contained'
                    sx={{ mb: 2.5, whiteSpace: 'nowrap' }}
                    onClick={() => {
                      toggleAdd()
                    }}
                  >
                    Agregar rol
                  </Button>
                  <Typography variant='body2'>Agregue rol que no existe</Typography>
                </Box>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </Grid>}
      <UsersNotRol id={rolId} toggle={toggleUsers} open={openNotrolUser}/>
      <UsersRol data={rol} toggle={toggleDesasigned} open={openDesasigned}/>
      <AddRol open={openAdd} toggle={toggleAdd}/>
      <EditRol open={openEdit} toggle={toggleEdit} data={rol}/>
    </Grid>
  )
}

export default RolesCards
