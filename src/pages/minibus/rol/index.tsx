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
import { addRol, fetchData } from 'src/store/apps/rol'
import getConfig from 'src/configs/environment'
import { useService } from 'src/hooks/useService'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Menu, MenuItem } from '@mui/material'
import UsersNotRol from './users'

const RolesCards = () => {
  // ** States
  const [open, setOpen] = useState<boolean>(false)
  const [dialogTitle, setDialogTitle] = useState<'Agregar' | 'Editar'>('Agregar')
  const [selectedPermissions, setSelectedPermissions] = useState<{ [key: string]: string[] }>({})
  const [isIndeterminateCheckbox, setIsIndeterminateCheckbox] = useState<boolean>(false)
  const [permissions, setPermissions] = useState<any[]>([])
  const [acces, setAcces] = useState<any[]>([])
  const [name, setName] = useState<string>('')
  const [anchorEl, setAnchorEl] = useState(null);
  const [openNotrolUser, setOpenNotuser] = useState(false)
  const [rolId,SetRolId] = useState<string>('')
  const openAnchor = Boolean(anchorEl);

  const { Get } = useService()

  const handleClickOpen = () => setOpen(true)

  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.rol)

  const toggleUsers = ()=>setOpenNotuser(!openNotrolUser)

  useEffect(() => {
    const fetch = async () => {
      const res = await Get('/permissions')
      setPermissions(res.data)
    }
    fetch()
  }, [])

  useEffect(() => {
    const fetch = async () => {
      const res = await Get('/componentes')
      setAcces(res.data)
    }
    fetch()
  }, [])

  useEffect(() => {
    dispatch(fetchData())
  }, [dispatch])

  const handleClose = () => {
    setOpen(false)
    setSelectedPermissions({})
    setIsIndeterminateCheckbox(false)
  }

  const togglePermission = (rowId: string, permissionId: string) => {
    const updatedSelectedPermissions = { ...selectedPermissions }
    const rowPermissions = updatedSelectedPermissions[rowId] || []

    if (rowPermissions.includes(permissionId)) {
      updatedSelectedPermissions[rowId] = rowPermissions.filter(id => id !== permissionId)
    } else {
      updatedSelectedPermissions[rowId] = [...rowPermissions, permissionId]
    }

    setSelectedPermissions(updatedSelectedPermissions)
  }
  const handleCloseAnchor = () => {
    setAnchorEl(null);
  };

  const handleClick = (event:any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleSelectAllCheckbox = () => {
    const allSelected = Object.keys(selectedPermissions).length === acces.length
    const updatedSelectedPermissions = allSelected ? {} : acces.reduce((acc: any, access: any) => {
      acc[access._id] = permissions.map(permission => permission._id)
      return acc
    }, {})
    setSelectedPermissions(updatedSelectedPermissions)
  }

  useEffect(() => {
    const totalPermissions = permissions.length * acces.length
    const selectedCount = Object.values(selectedPermissions).reduce((acc, val) => acc + val.length, 0)
    setIsIndeterminateCheckbox(selectedCount > 0 && selectedCount < totalPermissions)
  }, [selectedPermissions, permissions, acces])

  const handleCreate = () => {
    // Convierte el objeto selectedPermissions a un array de objetos { accessId, permissionIds }
    const accessArray = Object.entries(selectedPermissions).map(([accessId, permissionIds]) => ({
      accessId,
      permissionIds
    }))

    // Crea el objeto dataFul con el nombre del rol y el array de access
    const dataFul = {
      name: name,
      access: accessArray
    }

    // Despacha la acción addRol con el objeto dataFul
    dispatch(addRol(dataFul))
  }

  const AsignedRol = (id:string)=>{
    SetRolId(id)
    toggleUsers()
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
                    <Avatar key={index} alt={user.name} src={`${getConfig().backendURI}/${user.profile}`} />
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
                  <MenuItem onClick={handleCloseAnchor}>Editar</MenuItem>
                  <MenuItem onClick={handleCloseAnchor}>Eliminar</MenuItem>
                </Menu>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='h6'>{rol.name}</Typography>
                <Typography
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
                </Typography>
              </Box>
              <Typography
                href='/'
                variant='body2'
                component={Link}
                sx={{ color: 'primary.main' }}
                onClick={(e: SyntheticEvent) => {
                  e.preventDefault()
                  toggleUsers()
                }}
              >
                Quitar usuarios
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ))

  return (
    <Grid container spacing={6} className='match-height'>
      {renderCards()}
      <Grid item xs={12} sm={6} lg={4}>
        <Card
          sx={{ cursor: 'pointer' }}
          onClick={() => {
            handleClickOpen()
            setDialogTitle('Agregar')
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
                      handleClickOpen()
                      setDialogTitle('Agregar')
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
        <UsersNotRol id={rolId} toggle={toggleUsers} open={openNotrolUser}/>
      </Grid>
      <Dialog fullWidth maxWidth='md' scroll='body' onClose={handleClose} open={open}>
        <DialogTitle sx={{ textAlign: 'center' }}>
          <Typography variant='h5' component='span'>
            {`${dialogTitle} Role`}
          </Typography>
          <Typography variant='body2'>Establecer permisos de roles</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 6, sm: 12 } }}>
          <Box sx={{ my: 4 }}>
            <FormControl fullWidth>
              <TextField
                label='Nombre del rol'
                placeholder='Introduzca el rol'
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </FormControl>
          </Box>
          <Typography variant='h6'>Permisos de roles</Typography>
          <TableContainer>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ pl: '0 !important' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        fontSize: '0.875rem',
                        whiteSpace: 'nowrap',
                        alignItems: 'center',
                        textTransform: 'capitalize',
                        '& svg': { ml: 1, cursor: 'pointer' }
                      }}
                    >
                      Acceso de administrador
                      <Tooltip placement='top' title='Allows a full access to the system'>
                        <Box sx={{ display: 'flex' }}>
                          <Icon icon='mdi:information-outline' fontSize='1rem' />
                        </Box>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell colSpan={permissions.length}>
                    <FormControlLabel
                      label='Seleccionar todo'
                      sx={{ '& .MuiTypography-root': { textTransform: 'capitalize' } }}
                      control={
                        <Checkbox
                          size='small'
                          onChange={handleSelectAllCheckbox}
                          indeterminate={isIndeterminateCheckbox}
                          checked={Object.keys(selectedPermissions).length === acces.length}
                        />
                      }
                    />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {acces.map((access: any, rowIndex: number) => (
                  <TableRow key={rowIndex} sx={{ '& .MuiTableCell-root:first-of-type': { pl: '0 !important' } }}>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        color: theme => `${theme.palette.text.primary} !important`
                      }}
                    >
                      {access.name}
                    </TableCell>
                    {permissions.map((permission) => (
                      <TableCell key={`${permission._id}-${access._id}`}>
                        <FormControlLabel
                          label={permission.name}
                          control={
                            <Checkbox
                              size='small'
                              id={`${permission._id}-${access._id}`}
                              onChange={() => togglePermission(access._id, permission._id)}
                              checked={selectedPermissions[access._id]?.includes(permission._id) || false}
                            />
                          }
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions sx={{ pt: 0, display: 'flex', justifyContent: 'center' }}>
          <Box className='demo-space-x'>
            <Button size='large' type='submit' variant='contained' onClick={handleCreate}>
              Guardar
            </Button>
            <Button size='large' color='secondary' variant='outlined' onClick={handleClose}>
              Cancelar
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default RolesCards
