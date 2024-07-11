import { Autocomplete, Avatar, Box, Button, Card, CardMedia, FormControl, FormHelperText, Grid, IconButton, InputAdornment, OutlinedInput, TextField, Typography } from "@mui/material"
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { Password, Visibility, VisibilityOff } from "@mui/icons-material";
import { styled } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { addUser, updateUser } from "src/store/apps/users";
import { addLicenceDriver, updateLicence } from "src/store/apps/licence-driver";
import AddIcon from '@mui/icons-material/Add';
import KeyboardControlKeyIcon from '@mui/icons-material/KeyboardControlKey';
import { AppDispatch } from "src/store";
import { contrys } from "src/utils/contrys";
import { isPhoneValidate } from "src/utils/validator";
import { calculateYearsBetweenDates } from "src/utils/calculateYears";
import { HttpStatus } from "src/utils/HttpStatus";
import Swal from "sweetalert2";
// import { useService } from "src/hooks/useService";
import { isImage } from "src/utils/verificateImg";
import getConfig from 'src/configs/environment'
import { apiService } from "src/store/services/apiService";

interface FormErrors {
  name?: string;
  email?: string;
  profile?: null,
  lastName?: string,
  password?: string,
  ci?: string,
  phone?: string,
  address?: string,
  category?: string,
  dateEmition?: string,
  dateExpire?: string,
}
interface Props {
  toggle: () => void;
  id: string
  store: any
}

const genders = [
  'Masculino',
  'Femenina',
  'Otro'
]
interface liceneTypes {
  category: string
  dateEmition: Date | null
  dateExpire: Date | null
  licenceFront: File | null
  licenceBack: File | null
}
interface userTypes {
  profile: File | null,
  name: string,
  lastName: string,
  gender: string,
  email: string,
  password: string,
  ci: string,
  phone: string,
  address: string,
  contry: string,
  licenceId: string | null,
  otherGender: string
}
const defaultUserData = {
  profile: null,
  name: '',
  lastName: '',
  gender: genders[0],
  email: '',
  ci: '',
  phone: '',
  password: '',
  address: '',
  contry: contrys[0],
  licenceId: null,
  otherGender: ''
}
const defaultLicenceData = {
  category: '',
  dateEmition: null,
  dateExpire: null,
  licenceFront: null,
  licenceBack: null
}
const defaultErrors = {
  name: '',
  lastName: '',
  email: '',
  ci: '',
  phone: '',
  address: '',
  password: '',
  category: '',
  dateEmition: '',
  dateExpire: '',
}
const phoneRegex = /^\(\+\d{1,3}\) \d{7,10}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
const EditUser = ({ toggle, id, store }: Props) => {

  const [formUser, setformUser] = useState<userTypes>(defaultUserData)
  const [formLicence, setFormLicence] = useState<liceneTypes>(defaultLicenceData)
  const [formErrors, setFormErrors] = useState<FormErrors>(defaultErrors)
  const [self, setSelf] = useState('/images/avatars/2.png')
  const [profile, setProfile] = useState<File | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [errorMessageFront, setErrorMessageFront] = useState('')
  const [errorMessageBack, setErrorMessageBack] = useState('')
  const [front, setFront] = useState<string>('/images/default/licence.png')
  const [back, setBack] = useState<string>('/images/default/licence.png')
  const [licenceFront, setLicenceFront] = useState<File | null>(null)
  const [licenceBack, setLicenceBack] = useState<File | null>(null)
  const [onAddLicence, setOnAddLicence] = useState(false)
  const [userId, setUserId] = useState('')
  const [licenceId, setLicenceId] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // const { GetId } = useService()
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    if (id) {
      const fetch = async () => {
        const response = await apiService.GetId('/users', id)

        const UserData = {
          profile: response.data.profile,
          name: response.data.name,
          lastName: response.data.lastName,
          gender: genders[2],
          email: response.data.email,
          password: '',
          ci: response.data.ci,
          phone: response.data.phone,
          address: response.data.address,
          contry: contrys[0],
          licenceId: response.data.licenceId,
          otherGender: response.data.gender
        }
        const img = await isImage(`${getConfig().backendURI}${response.data.profile}`)
        if (img) {
          setSelf(`${getConfig().backendURI}${response.data.profile}`)
        }
        genders.map((value, index) => {
          if (value == response.data.gender) {
            UserData.gender = genders[index]
          }
        })
        contrys.map((value, index) => {
          if (value == response.data.contry) {
            UserData.contry = contrys[index]
          }
        })
        if (response.data.licenceId) {
          setOnAddLicence(true)
          const licence = await apiService.GetId('/licencia', response.data.licenceId.toString())
          const LicenceData = {
            category: licence.data.category,
            dateEmition: licence.data.dateEmition,
            dateExpire: licence.data.dateExpire,
            licenceFront: licence.data.licenceFront,
            licenceBack: licence.data.licenceBack
          }
          const imgF = await isImage(`${getConfig().backendURI}${licence.data.licenceFront}`)
          if (imgF) { setFront(`${getConfig().backendURI}${licence.data.licenceFront}`) }
          const imgB = await isImage(`${getConfig().backendURI}${licence.data.licenceBack}`)
          if (imgB) { setBack(`${getConfig().backendURI}${licence.data.licenceBack}`) }
          setLicenceId(response.data.id)
          setFormLicence(LicenceData)
        } else { setOnAddLicence(false) }
        setUserId(response.data.id)
        setformUser(UserData)
      }
      fetch()
    }
  }, [id, store])
  const handleImageFront = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file?.type.startsWith('image/')) {
      setLicenceFront(file)
      const imgURL = URL.createObjectURL(file);
      setFront(imgURL);
      setErrorMessageFront('')
    } else {
      setErrorMessageFront('Por favor, selecciona un archivo de imagen válido.')
      setFront('/images/default/licence.png')
    }
  }
  const handleImageBack = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file?.type.startsWith('image/')) {
      setLicenceBack(file)
      const imgURL = URL.createObjectURL(file);
      setBack(imgURL)
      setErrorMessageBack('')
    } else {
      setErrorMessageBack('Por favor, selecciona un archivo de imagen válido.')
      setBack('/images/default/licence.png')
    }

  }
  const handleChangePhone = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (isPhoneValidate(value)) {
      setformUser({
        ...formUser,
        [name]: value
      })
    }

  }
  const handleChangeFields = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setformUser({
      ...formUser,
      [name]: value
    })
    setFormErrors({
      ...formErrors,
      [name]: ''
    })
  }
  const handleChangeFieldsLicence = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormLicence({
      ...formLicence,
      [name]: value
    })
    setFormErrors({
      ...formErrors,
      [name]: ''
    })
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(handleErrors())
    if (!handleErrors()) {
      formUser.profile = profile
      if (formUser.gender === 'Otro') { formUser.gender = formUser.otherGender }
      if (onAddLicence) {
        formLicence.licenceBack = licenceBack;
        formLicence.licenceFront = licenceFront;
        dispatch(updateUser({ userData: formUser, licenceData: formLicence, idUser: userId, idLicence: licenceId }))
          .then((response: any) => {
            if (response.payload.status === HttpStatus.BAD_REQUEST) {

              formErrors.name = response.payload.data.address

              formErrors.ci = response.payload.data.ci
              formErrors.email = response.payload.data.email
              formErrors.lastName = response.payload.data.lastName
              formErrors.name = response.payload.data.name
              formErrors.password = response.payload.data.password
              formErrors.phone = response.payload.data.phone
              formErrors.profile = response.payload.data.profile
              setFormErrors(formErrors)
            } else if (response.payload.status === HttpStatus.OK) {
              Swal.fire({ title: '¡Éxito!', text: 'Datos actualizados exitosamente', icon: "success" });
              toggle()
            }
          })
      } else {
        dispatch(updateUser({ userData: formUser, idUser: userId })).then((response) => {
            if (response.payload.status === HttpStatus.BAD_REQUEST) {

              formErrors.name = response.payload.data.address

              formErrors.ci = response.payload.data.ci
              formErrors.email = response.payload.data.email
              formErrors.lastName = response.payload.data.lastName
              formErrors.name = response.payload.data.name
              formErrors.password = response.payload.data.password
              formErrors.phone = response.payload.data.phone
              formErrors.profile = response.payload.data.profile
              setFormErrors(formErrors)
            } else if (response.payload.status === HttpStatus.OK) {
              Swal.fire({ title: '¡Éxito!', text: 'Datos actualizados exitosamente', icon: "success" });
              toggle()
            }
        })
      }
    }
  }
  const handleProfileOnchage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files?.[0] || null
      if (file?.type.startsWith('image/')) {
        setProfile(file)
        const imgURL = URL.createObjectURL(file);
        setSelf(imgURL);
        setErrorMessage('')
      } else {
        setErrorMessage('Por favor, selecciona un archivo de imagen válido.')
        setSelf('/images/avatars/2.png')
      }
    }
  }
  const handleErrors = (): boolean => {
    let status = false
    const Errors: FormErrors = {};
    if (!formUser.name) {
      status = true
      Errors.name = 'El campo nombre es requerido';
    }
    if (!/^[\sa-zA-Z]+$/.test(formUser.name.trim())) {
      status = true
      Errors.name = 'El campo nombre debe contener solo letras y espacios';
    }
    if (!formUser.lastName) {
      status = true
      Errors.lastName = 'El campo apellido es requerido';
    }
    if (!/^[\sa-zA-Z]+$/.test(formUser.lastName.trim())) {
      status = true
      Errors.name = 'El campo apellido debe contener solo letras y espacios';
    }
    if (formUser.name.length > 30) {
      status = true
      Errors.name = 'El campo nombre es demaciado grande';
    }
    if (formUser.name.length < 3) {
      status = true
      Errors.name = 'El campo nombre debe ser minimo de 3 caracteres';
    }
    if (formUser.name.length > 50) {
      status = true
      Errors.lastName = 'El campo apellido es demaciado grande'
    }
    if (!formUser.email) {
      status = true
      Errors.email = 'El campo Correo electrónico es requerido';
    }
    if (!formUser.ci) {
      status = true
      Errors.ci = 'El campo ci es requerido';
    }
    if (formUser.ci.length < 6) {
      status = true
      Errors.ci = 'El campo ci debe ser como mínimo 6 caracteres'
    }
    if (formUser.ci.length > 20) {
      status = true
      Errors.ci = 'El campo ci debe ser máximo de 6 caracteres'
    }
    if (!formUser.address) {
      status = true
      Errors.address = 'El campo direccion es requerido es requerido';
    }
    if (formUser.password) {
      if (formUser.password.length < 8) {
        status = true
        Errors.password = 'La contraseña debe ser como minimo de 8 caracteres'
      }
      if (formUser.password.length > 30) {
        status = true
        Errors.password = 'La contraseña debe ser maximo de 30 caracteres'
      }
      if (!/[A-Z]/.test(formUser.password)) {
        status = true
        Errors.password = 'La contraseña debe contener al menos una letra mayúscula';
      }
      if (!/[\W_]/.test(formUser.password)) {
        status = true
        Errors.password = 'La contraseña debe contener al menos un símbolo';
      }
    }
    if (!emailRegex.test(formUser.email)) {
      status = true
      Errors.email = 'Correo electrónico inválido.'
    }
    if (!formLicence.category && onAddLicence) {
      status = true
      Errors.category = 'El campo categoría es requerido'
    }
    if (!formLicence.dateEmition && onAddLicence) {
      status = true
      Errors.dateEmition = 'El campo Fecha de emición es requerido'
    }
    if (!formLicence.dateExpire && onAddLicence) {
      status = true
      Errors.dateExpire = 'El campo Fecha de expire es requerido'
    }
    if (formLicence.dateEmition && formLicence.dateExpire) {
      const years = calculateYearsBetweenDates(formLicence.dateEmition, formLicence.dateExpire)
      if (years < 2) {
        Errors.dateExpire = 'La fecha debe ser mayor a 2 años'
      }
    }
    console.log(Errors)
    setFormErrors(Errors)
    return status
  }
  const handleGenderOnchange = (e: SelectChangeEvent) => {
    const { name, value } = e.target
    setformUser({
      ...formUser,
      [name]: value
    })
    setFormErrors({
      ...formErrors,
      [name]: ''
    })
  }
  return (<Box>
    <form onSubmit={onSubmit}>
      <fieldset style={{ border: '1.5px solid #E0E0E0', borderRadius: 10, paddingTop: 20 }}>
        <legend style={{ textAlign: 'center' }}><Typography variant='subtitle2'>Agregar Nuevo Usuario</Typography></legend>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Avatar
                alt='user'
                src={self}
                sx={{ width: 100, height: 100, backgroundColor: '#E0E0E0', border: 'solid 1px #E0E0E0' }} />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <label htmlFor="update-img" style={{ cursor: 'pointer' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  border: 'solid 1px #E0E0E0',
                  borderRadius: 1,
                  justifyContent: 'center',
                  padding: 2,
                  mb: 6
                }}
              >
                <CloudUploadIcon />
                <Typography variant="subtitle2">Seleccionar imagen</Typography>
                {errorMessage && <FormHelperText sx={{ color: 'error.main' }}>{errorMessage}</FormHelperText>}
              </Box>
            </label>
            <input
              id="update-img"
              type="file"
              style={{ display: 'none' }}
              onChange={handleProfileOnchage}
              accept='image/*'
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <TextField
                label='Nombres'
                name="name"
                placeholder='Juan Carlos'
                onChange={handleChangeFields}
                error={Boolean(formErrors.name)}
                helperText={formErrors.name}
                value={formUser.name}
                autoComplete='off'
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <TextField
                label='Apellidos'
                name="lastName"
                placeholder='Benitez Lopez'
                onChange={handleChangeFields}
                error={Boolean(formErrors.lastName)}
                helperText={formErrors.lastName}
                value={formUser.lastName}
                autoComplete='off'
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <InputLabel id="demo-simple-select-label">Género</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="gender"
                value={formUser.gender}
                label="Género"
                onChange={handleGenderOnchange}
                autoComplete='off'
              >
                {genders.map((gender) => (<MenuItem
                  value={gender}
                  key={gender}
                >{gender}</MenuItem>))}
              </Select>
            </FormControl>
          </Grid>
          {formUser.gender == "Otro" ?
            <Grid item xs={6}>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <TextField
                  label='Género (opcional)'
                  name="otherGender"
                  placeholder='otro'
                  onChange={handleChangeFields}
                  value={formUser.otherGender}
                  autoComplete='off'
                />
              </FormControl>
            </Grid> : ''
          }
          <Grid item xs={6}>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <TextField
                label='Ci'
                name="ci"
                placeholder='3456762-a'
                onChange={handleChangeFields}
                error={Boolean(formErrors.ci)}
                helperText={formErrors.ci}
                value={formUser.ci}
                autoComplete='off'
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <TextField
                label='Celular'
                name="phone"
                placeholder='(591) 72381722'
                onChange={handleChangePhone}
                value={formUser.phone}
                autoComplete='off'
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth sx={{ mb: 6 }}>
              <TextField
                label='Dirección'
                name="address"
                placeholder='Av. Las banderas'
                onChange={handleChangeFields}
                error={Boolean(formErrors.address)}
                helperText={formErrors.address}
                value={formUser.address}
                autoComplete='off'
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth >
              <Autocomplete
                options={contrys}
                getOptionLabel={(option) => option}
                onChange={(event, value) => setformUser({
                  ...formUser,
                  contry: value as string
                })}
                value={formUser.contry}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label='País'
                    autoComplete='off'
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          {params.InputProps.startAdornment}
                        </>
                      )
                    }}
                  />

                )}
                sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
              />
            </FormControl>

          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <TextField
                name="email"
                label='Correo electrónico'
                placeholder='expale@gmail.com'
                onChange={handleChangeFields}
                error={Boolean(formErrors.email)}
                helperText={formErrors.email}
                value={formUser.email}
                autoComplete='off'
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <InputLabel htmlFor="outlined-adornment-password" >Contraseña</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              error={Boolean(formErrors.password)}
              value={formUser.password}
              onChange={handleChangeFields}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((prevShow) => !prevShow)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Contraseña"
            />
            {formErrors.password && <FormHelperText sx={{ color: 'error.main' }}>{formErrors.password}</FormHelperText>}
          </FormControl>
        </Grid>
        {onAddLicence ?
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <TextField
                  label='Categoria de la licencia'
                  name="category"
                  placeholder='A'
                  onChange={handleChangeFieldsLicence}
                  error={Boolean(formErrors.category)}
                  helperText={formErrors.category}
                  value={formLicence.category}
                  autoComplete='off'
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <TextField
                  label='Fecha de emición'
                  name="dateEmition"
                  type='date'
                  onChange={handleChangeFieldsLicence}
                  error={Boolean(formErrors.dateEmition)}
                  helperText={formErrors.dateEmition}
                  value={formLicence.dateEmition}
                  InputLabelProps={{ shrink: true }}
                  autoComplete='off'
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <TextField
                  label='Fecha de expiración'
                  name="dateExpire"
                  type='date'
                  onChange={handleChangeFieldsLicence}
                  error={Boolean(formErrors.dateExpire)}
                  helperText={formErrors.dateExpire}
                  value={formLicence.dateExpire}
                  InputLabelProps={{ shrink: true }}
                  autoComplete='off'
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <Card>
                  <CardMedia sx={{ height: 200 }} image={front} />
                  <Button component="label" size='large' variant="contained"
                    sx={{ width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
                    startIcon={<CloudUploadIcon />}
                  >
                    Seleccionar Foto de Licencia frontal
                    <VisuallyHiddenInput type="file"
                      onChange={handleImageFront} accept='image/*' />
                  </Button>
                  {errorMessageFront && <Box style={{ color: 'red' }}>{errorMessageFront}</Box>}
                </Card>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ mb: 6 }}>
                <Card>
                  <CardMedia sx={{ height: 200 }} image={back} />
                  <Button component="label" size='large' variant="contained" sx={{ width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 }} startIcon={<CloudUploadIcon />}>
                    Seleccionar Foto de Licencia trasera
                    <VisuallyHiddenInput type="file"
                      onChange={handleImageBack} accept='image/*' />
                  </Button>
                  {errorMessageBack && <Box style={{ color: 'red' }}>{errorMessageBack}</Box>}
                </Card>
              </FormControl>
            </Grid>
          </Grid>

          : ''
        }
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
          <Button startIcon={onAddLicence ? <KeyboardControlKeyIcon /> : <AddIcon />} onClick={() => setOnAddLicence(!onAddLicence)}>
            {onAddLicence ? 'no agregar licencia' : 'agregar licencia'}
          </Button>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button size='large' variant='outlined' color='secondary' onClick={toggle} startIcon={<CancelIcon />}>
            Cancelar
          </Button>
          <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }} startIcon={<SaveIcon />}>
            Guardar
          </Button>
        </Box>
      </fieldset>
    </form>
  </Box>)
}
export default EditUser;
