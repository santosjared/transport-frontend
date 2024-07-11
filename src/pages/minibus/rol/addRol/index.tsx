import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import Icon from "src/@core/components/icon"
// import { useService } from "src/hooks/useService"
import { AppDispatch } from "src/store"
import { addRol } from "src/store/apps/rol"
import { apiService } from "src/store/services/apiService"
import Swal from "sweetalert2"

interface Props {
  open: boolean
  toggle: () => void
}
const AddRol = ({ open, toggle }: Props) => {
  const [name, setName] = useState<string>('')
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [checkOption, setCheckOption] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [accesos, setAccesos] = useState<any[]>([])
  const [isLoading,setIsLoading] = useState(false)
  const [errorName, setErrorName] = useState<string>('')

  const dispatch = useDispatch<AppDispatch>()
  // const { Get } = useService()
  useEffect(() => {
    const fetchData = async () => {
        const accesos = await apiService.Get('/componentes')
      setAccesos(accesos.data);
    };
    fetchData();
  }, []);
  const checkPermission = (param: string) => {
    // Buscar si el acceso existe en el array
    const acceso = accesos.find(acceso => acceso.name === param);

    if (acceso) {
      // Si el _id ya está en selectedPermissions, lo quitamos, si no, lo agregamos
      if (selectedPermissions.includes(acceso._id)) {
        setCheckOption(checkOption.filter(name => name !== param))
        setSelectedPermissions(selectedPermissions.filter(id => id !== acceso._id));
      } else {
        setCheckOption([...checkOption, param])
        setSelectedPermissions([...selectedPermissions, acceso._id]);
      }
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      // Deseleccionar todos
      setCheckOption([]);
      setSelectedPermissions([]);
    } else {
      // Seleccionar todos
      const allPermissions = accesos.map(acceso => acceso.name);
      const allPermissionIds = accesos.map(acceso => acceso._id);
      setCheckOption(allPermissions);
      setSelectedPermissions(allPermissionIds);
    }
    setSelectAll(!selectAll);
  };

  const handleSubmit = async () =>{
    try {
      const response = await dispatch(addRol({name:name, access:selectedPermissions}))
      if (response.payload.success) {
        Swal.fire({ title: '¡Éxito!', text: 'Datos guardados exitosamente', icon: "success" });
        handleReset()
      } else {
        if (response.payload.data) {
          setErrorName(response.payload.data.name)
        }
        else { Swal.fire({ title: '¡Error!', text: 'ocurio un error al guardar los datos', icon: "error" }); handleReset() }
      }
    } catch (error) {
      Swal.fire({ title: '¡Error!', text: 'ocurio un error al guardar los datos', icon: "error" });
      handleReset()
    } finally {
      setIsLoading(false)
    }

  }
  const handleReset = () =>{
    setName('')
    setSelectAll(false)
    setSelectedPermissions([])
    setCheckOption([])
    setErrorName('')
    toggle()
  }

  return (
    <Dialog fullWidth maxWidth='md' scroll='body' onClose={toggle} open={open}>
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Typography variant='h5' component='span'>Agregar Rol</Typography>
        <Typography variant='body2'>Establecer permisos de roles</Typography>
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 6, sm: 12 } }}>
        <Box sx={{ my: 4 }}>
          <FormControl fullWidth>
            <TextField
              label='Nombre del rol'
              placeholder='Ingrese en nombre del rol'
              value={name}
              error={Boolean(errorName)}
              helperText = {errorName}
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
                <TableCell colSpan={6}>
                  <FormControlLabel
                    label='Seleccionar todo'
                    sx={{ '& .MuiTypography-root': { textTransform: 'capitalize' } }}
                    control={
                      <Checkbox
                        size='small'
                        checked={selectAll}
                        onChange={handleSelectAll}
                      />
                    }
                  />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>

              <TableRow sx={{ '& .MuiTableCell-root:first-of-type': { pl: '0 !important' } }}>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    color: theme => `${theme.palette.text.primary} !important`
                  }}
                >
                  Monitoreo
                </TableCell>
                <TableCell colSpan={6} >
                  <FormControlLabel
                    label={'Ver'}
                    control={
                      <Checkbox
                        size='small'
                        checked={checkOption.includes('Listar-monitoreo') || false}
                        id={`Listar-monitoreo`}
                        onChange={() => checkPermission('Listar-monitoreo')}
                      />
                    }
                  />
                </TableCell>
              </TableRow>
              <TableRow sx={{ '& .MuiTableCell-root:first-of-type': { pl: '0 !important' } }}>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    color: theme => `${theme.palette.text.primary} !important`
                  }}
                >
                  Registro de usuarios
                </TableCell>
                <TableCell>
                  <FormControlLabel
                    label={'Ver'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Listar-usuarios`}
                        checked={checkOption.includes('Listar-usuarios')|| false}
                        onChange={() => checkPermission('Listar-usuarios')}
                      />
                    }
                  />
                </TableCell>
                <TableCell >
                  <FormControlLabel
                    label={'Editar'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Editar-usuarios`}
                        checked={checkOption.includes('Editar-usuarios')|| false}
                        onChange={() => checkPermission('Editar-usuarios')}
                      />
                    }
                  />
                </TableCell>
                <TableCell >
                  <FormControlLabel
                    label={'Eliminar'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Eliminar-usuarios`}
                        checked={checkOption.includes('Eliminar-usuarios')|| false}
                        onChange={() => checkPermission('Eliminar-usuarios')}
                      />
                    }
                  />
                </TableCell>
                <TableCell >
                  <FormControlLabel
                    label={'Crear'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Crear-usuarios`}
                        checked={checkOption.includes('Crear-usuarios')|| false}
                        onChange={() => checkPermission('Crear-usuarios')}
                      />
                    }
                  />
                </TableCell>
                <TableCell colSpan={2}>
                  <FormControlLabel
                    label={'Detalles'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Detalles-usuarios`}
                        checked={checkOption.includes('Detalles-usuarios')|| false}
                        onChange={() => checkPermission('Detalles-usuarios')}
                      />
                    }
                  />
                </TableCell>
              </TableRow>
              <TableRow sx={{ '& .MuiTableCell-root:first-of-type': { pl: '0 !important' } }}>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    color: theme => `${theme.palette.text.primary} !important`
                  }}
                >
                  Roles y permisos
                </TableCell>
                <TableCell >
                  <FormControlLabel
                    label={'Ver'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Listar-rol`}
                        checked={checkOption.includes('Listar-rol')|| false}
                        onChange={() => checkPermission('Listar-rol')}
                      />
                    }
                  />
                </TableCell>
                <TableCell >
                  <FormControlLabel
                    label={'Ver'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Editar-rol`}
                        checked={checkOption.includes('Editar-rol')|| false}
                        onChange={() => checkPermission('Editar-rol')}
                      />
                    }
                  />
                </TableCell>
                <TableCell >
                  <FormControlLabel
                    label={'Eliminar'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Eliminar-rol`}
                        checked={checkOption.includes('Eliminar-rol')|| false}
                        onChange={() => checkPermission('Eliminar-rol')}
                      />
                    }
                  />
                </TableCell>
                <TableCell >
                  <FormControlLabel
                    label={'Crear'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Crear-rol`}
                        checked={checkOption.includes('Crear-rol')|| false}
                        onChange={() => checkPermission('Crear-rol')}
                      />
                    }
                  />
                </TableCell>
                <TableCell >
                  <FormControlLabel
                    label={'Agregar usuario'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Agregar-rol`}
                        checked={checkOption.includes('Agregar-rol')|| false}
                        onChange={() => checkPermission('Agregar-rol')}
                      />
                    }
                  />
                </TableCell>
                <TableCell >
                  <FormControlLabel
                    label={'Quitar usuarios'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Quitar-rol`}
                        checked={checkOption.includes('Quitar-rol')|| false}
                        onChange={() => checkPermission('Quitar-rol')}
                      />
                    }
                  />
                </TableCell>
                </TableRow>
              <TableRow sx={{ '& .MuiTableCell-root:first-of-type': { pl: '0 !important' } }}>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    color: theme => `${theme.palette.text.primary} !important`
                  }}
                >
                  Registro de Microbuses
                </TableCell>
                <TableCell >
                  <FormControlLabel
                    label={'Ver'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Listar-microbus`}
                        checked={checkOption.includes('Listar-microbus')|| false}
                        onChange={() => checkPermission('Listar-microbus')}
                      />
                    }
                  />
                </TableCell>
                <TableCell >
                  <FormControlLabel
                    label={'Editar'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Editar-microbus`}
                        checked={checkOption.includes('Editar-microbus')|| false}
                        onChange={() => checkPermission('Editar-microbus')}
                      />
                    }
                  />
                </TableCell>
                <TableCell >
                  <FormControlLabel
                    label={'Eliminar'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Eliminar-microbus`}
                        checked={checkOption.includes('Eliminar-microbus')|| false}
                        onChange={() => checkPermission('Eliminar-microbus')}
                      />
                    }
                  />
                </TableCell>
                <TableCell >
                  <FormControlLabel
                    label={'Crear'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Crear-microbus`}
                        checked={checkOption.includes('Crear-microbus')|| false}
                        onChange={() => checkPermission('Crear-microbus')}
                      />
                    }
                  />
                </TableCell>
                <TableCell >
                  <FormControlLabel
                    label={'Detalles'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Detalles-microbus`}
                        checked={checkOption.includes('Detalles-microbus')|| false}
                        onChange={() => checkPermission('Detalles-microbus')}
                      />
                    }
                  />
                </TableCell>
                <TableCell >
                  <FormControlLabel
                    label={'Asignar usuario'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Asignar_usuario-microbus`}
                        checked={checkOption.includes('Asignar_usuario-microbus')|| false}
                        onChange={() => checkPermission('Asignar_usuario-microbus')}
                      />
                    }
                  />
                </TableCell>
              </TableRow>
              <TableRow sx={{ '& .MuiTableCell-root:first-of-type': { pl: '0 !important' } }}>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    color: theme => `${theme.palette.text.primary} !important`
                  }}
                >
                  Registro de Tarifas
                </TableCell>
                <TableCell >
                  <FormControlLabel
                    label={'Ver'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Listar-tarifa`}
                        checked={checkOption.includes('Listar-tarifa')|| false}
                        onChange={() => checkPermission('Listar-tarifa')}
                      />
                    }
                  />
                </TableCell>
                <TableCell >
                  <FormControlLabel
                    label={'Editar'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Editar-tarifa`}
                        checked={checkOption.includes('Editar-tarifa')|| false}
                        onChange={() => checkPermission('Editar-tarifa')}
                      />
                    }
                  />
                </TableCell>
                <TableCell >
                  <FormControlLabel
                    label={'Eliminar'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Eliminar-tarifa`}
                        checked={checkOption.includes('Eliminar-tarifa')|| false}
                        onChange={() => checkPermission('Eliminar-tarifa')}
                      />
                    }
                  />
                </TableCell>
                <TableCell colSpan={3}>
                  <FormControlLabel
                    label={'Crear'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Crear-tarifa`}
                        checked={checkOption.includes('Crear-tarifa')|| false}
                        onChange={() => checkPermission('Crear-tarifa')}
                      />
                    }
                  />
                </TableCell>
              </TableRow>
              <TableRow sx={{ '& .MuiTableCell-root:first-of-type': { pl: '0 !important' } }}>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    color: theme => `${theme.palette.text.primary} !important`
                  }}
                >
                  Registro de horarios
                </TableCell>
                <TableCell >
                  <FormControlLabel
                    label={'Ver'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Listar-horario`}
                        checked={checkOption.includes('Listar-horario')|| false}
                        onChange={() => checkPermission('Listar-horario')}
                      />
                    }
                  />
                </TableCell>
                <TableCell >
                  <FormControlLabel
                    label={'Editar'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Editar-horario`}
                        checked={checkOption.includes('Editar-horario')|| false}
                        onChange={() => checkPermission('Editar-horario')}
                      />
                    }
                  />
                </TableCell>
                <TableCell >
                  <FormControlLabel
                    label={'Eliminar'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Eliminar-horario`}
                        checked={checkOption.includes('Eliminar-horario')|| false}
                        onChange={() => checkPermission('Eliminar-horario')}
                      />
                    }
                  />
                </TableCell>
                <TableCell colSpan={3} >
                  <FormControlLabel
                    label={'Crear'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Crear-horario`}
                        checked={checkOption.includes('Crear-horario')|| false}
                        onChange={() => checkPermission('Crear-horario')}
                      />
                    }
                  />
                </TableCell>
              </TableRow>
              <TableRow sx={{ '& .MuiTableCell-root:first-of-type': { pl: '0 !important' } }}>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    color: theme => `${theme.palette.text.primary} !important`
                  }}
                >
                  Registro de rutas
                </TableCell>
                <TableCell >
                  <FormControlLabel
                    label={'Ver'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Listar-ruta`}
                        checked={checkOption.includes('Listar-ruta')|| false}
                        onChange={() => checkPermission('Listar-ruta')}
                      />
                    }
                  />
                </TableCell>
                <TableCell >
                  <FormControlLabel
                    label={'Editar'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Editar-ruta`}
                        checked={checkOption.includes('Editar-ruta')|| false}
                        onChange={() => checkPermission('Editar-ruta')}
                      />
                    }
                  />
                </TableCell>
                <TableCell >
                  <FormControlLabel
                    label={'Eliminar'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Eliminar-ruta`}
                        checked={checkOption.includes('Eliminar-ruta')|| false}
                        onChange={() => checkPermission('Eliminar-ruta')}
                      />
                    }
                  />
                </TableCell>
                <TableCell colSpan={3}>
                  <FormControlLabel
                    label={'Crear'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Crear-ruta`}
                        checked={checkOption.includes('Crear-ruta')|| false}
                        onChange={() => checkPermission('Crear-ruta')}
                      />
                    }
                  />
                </TableCell>
              </TableRow>
              <TableRow sx={{ '& .MuiTableCell-root:first-of-type': { pl: '0 !important' } }}>
                <TableCell rowSpan={2}
                  sx={{
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    color: theme => `${theme.palette.text.primary} !important`
                  }}
                >
                  Registro de Lineas
                </TableCell>
                <TableCell >
                  <FormControlLabel
                    label={'Ver'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Listar-linea`}
                        checked={checkOption.includes('Listar-linea')|| false}
                        onChange={() => checkPermission('Listar-linea')}
                      />
                    }
                  />
                </TableCell>
                <TableCell >
                  <FormControlLabel
                    label={'Editar'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Editar-linea`}
                        checked={checkOption.includes('Editar-linea')|| false}
                        onChange={() => checkPermission('Editar-linea')}
                      />
                    }
                  />
                </TableCell>
                <TableCell >
                  <FormControlLabel
                    label={'Eliminar'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Eliminar-linea`}
                        checked={checkOption.includes('Eliminar-linea')|| false}
                        onChange={() => checkPermission('Eliminar-linea')}
                      />
                    }
                  />
                </TableCell>
                <TableCell >
                  <FormControlLabel
                    label={'Crear'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Crear-Linea`}
                        checked={checkOption.includes('Crear-Linea')|| false}
                        onChange={() => checkPermission('Crear-Linea')}
                      />
                    }
                  />
                </TableCell>
                <TableCell >
                  <FormControlLabel
                    label={'Ver rutas'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Listar_rutas-linea`}
                        checked={checkOption.includes('Listar_rutas-linea')|| false}
                        onChange={() => checkPermission('Listar_rutas-linea')}
                      />
                    }
                  />
                </TableCell>
                <TableCell >
                  <FormControlLabel
                    label={'Ver horarios'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Listar_horario-linea`}
                        checked={checkOption.includes('Listar_horario-linea')|| false}
                        onChange={() => checkPermission('Listar_horario-linea')}
                      />
                    }
                  />
                </TableCell>
              </TableRow>
              <TableRow sx={{ '& .MuiTableCell-root:first-of-type': { pl: '1 !important' } }}>
                <TableCell >
                  <FormControlLabel
                    label={'ver tarifas'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Listar_tarifas-linea`}
                        checked={checkOption.includes('Listar_tarifas-linea')|| false}
                        onChange={() => checkPermission('Listar_tarifas-linea')}
                      />
                    }
                  />
                </TableCell>
                <TableCell colSpan={4}>
                  <FormControlLabel
                    label={'ver buses'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Listar_buses-linea`}
                        checked={checkOption.includes('Listar_buses-linea')|| false}
                        onChange={() => checkPermission('Listar_buses-linea')}
                      />
                    }
                  />
                </TableCell>
              </TableRow>
              <TableRow sx={{ '& .MuiTableCell-root:first-of-type': { pl: '0 !important' } }}>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    color: theme => `${theme.palette.text.primary} !important`
                  }}
                >
                  Estados de conexion
                </TableCell>
                <TableCell colSpan={6}>
                  <FormControlLabel
                    label={'Ver'}
                    control={
                      <Checkbox
                        size='small'
                        id={`Listar-conexiones`}
                        checked={checkOption.includes('Listar-conexiones')|| false}
                        onChange={() => checkPermission('Listar-conexiones')}
                      />
                    }
                  />
                </TableCell>
                </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions sx={{ pt: 0, display: 'flex', justifyContent: 'center' }}>
        <Box className='demo-space-x'>
          <Button size='large' type='submit' variant='contained' onClick={handleSubmit}>
            Guardar
          </Button>
          <Button size='large' color='secondary' variant='outlined' onClick={handleReset}>
            Cancelar
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}
export default AddRol
