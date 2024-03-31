import React, { Fragment, useState,ChangeEvent} from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Step from '@mui/material/Step'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Stepper from '@mui/material/Stepper'
import StepLabel from '@mui/material/StepLabel'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Custom Components Imports
import StepperCustomDot from '../StepperCustomDot'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Styled Component
import StepperWrapper from 'src/@core/styles/mui/stepper'
import SnackbarConsecutive from '../../dialog/alert1'
import { styled } from '@mui/material/styles';
import CardMedia from '@mui/material/CardMedia';
import axios from 'axios';
import { Autocomplete } from '@mui/material';

interface CloseType{
  close: ()=>void
}
const steps = [
  {
    title: 'Informacion del Chofer'
  },
  {
    title: 'Licencia de conducir'
  }
]
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

const StepperAlternativeLabel = (props:CloseType) => {
  // ** States
  const {close} = props
  const [errorMessageFront,setErrorMessageFront] = useState('')
  const [errorMessageBack,setErrorMessageBack] = useState('')
  const [front,setFront] = useState<string>('/images/default/licence.png')
  const [back,setBack] = useState<string>('/images/default/licence.png')
  const [ci,setCi] = useState<string>('')
  const [birthdate,setBirthdate] = useState<string>('')
  const [location,setLocation] = useState<string>('')
  const [address,setAddress] = useState<string>('')
  const [phone,setPhone] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [numberLicence, setNumberLicence] = useState<string>('')
  const [country, setCountry] = useState<string>('')
  const [emition, setEmition] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [expiration, setExpiration] = useState<string>('')
  const [category, setCategory] = useState<string>('')
  const [firstName, setFirstName] = useState<string>('')
  const [activeStep, setActiveStep] = useState<number>(0)

  // Handle Stepper
  const handleReset = () =>{
    setErrorMessageFront('')
    setErrorMessageBack('')
    setFront('/images/default/licence.png')
    setBack('/images/default/licence.png')
    setCi('')
    setBirthdate('')
    setLocation('')
    setAddress('')
    setPhone('')
    setEmail('')
    setCountry('')
    setEmition('')
    setLastName('')
    setCategory('')
    setFirstName('')
    setNumberLicence('')
    setExpiration('')
    setActiveStep(0)
    close()
  }
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }
  const handleNext = async () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
    if (activeStep === steps.length - 1) {
      const driverData = {
        numberLicence,
        emition,
        expiration,
        category,
        front,
        back
      }
      try{
        const response = await axios.post('http://localhost:3001/drivelicence',driverData)
        if(response.status === 201){
          handleReset()
          toast.success('registro exitosa!')
        }else{
          console.error('Error en la solicitud:', response.data)
          toast.error('Hubo un error en el envió del formulario')
        }
      }catch (error){
        console.error('Error en la solicitud:', error)
        toast.error('Hubo un error al enviar el formulario');
      }
      toast.success('Form Submitted')
    }
  }
  const handleImageFront =(event:ChangeEvent<HTMLInputElement>)=>{
    const file = event.target.files?.[0]
    if(file?.type.startsWith('image/')){
      const imgURL = URL.createObjectURL(file);
      setFront(imgURL);
      setErrorMessageFront('')
    }else{
      setErrorMessageFront('Por favor, selecciona un archivo de imagen válido.')
      setFront('/images/default/licence.png')
    }
  }
  const handleImageBack = (event:ChangeEvent<HTMLInputElement>)=>{
    const file = event.target.files?.[0]
    if(file?.type.startsWith('image/')){
      const imgURL = URL.createObjectURL(file);
      setBack(imgURL)
      setErrorMessageBack('')
    }else{
      setErrorMessageBack('Por favor, selecciona un archivo de imagen válido.')
      setBack('/images/default/licence.png')
    }
  }
  const options = [
    {label:'user',value:'1'},
    {label:'user1',value:'2'},
    {label:'user2',value:'3'}
  ]
  const getStepContent = (step: number) => {
    const [onSelect, setOnSelect] = useState<any>(null)
    switch (step) {
      case 0:
        return (
          <Fragment key={step}>
            <Grid item xs={12} sm={12}>
              <Autocomplete 
              options={options}
              getOptionLabel={(options)=>options.label}
              onChange={(event,value)=> setOnSelect(value)}
              renderInput={(params)=> (
                <TextField
                {...params}
                label='Buscar usuario'
                InputProps={{
                  ...params.InputProps,
                  startAdornment:(
                    <>
                    {/* <SearchIcon /> */}
                    {params.InputProps.startAdornment}
                    </>
                  )
                }}
                />

              )}
              sx={{borderTopLeftRadius:0, borderTopRightRadius:0}}
              >

              </Autocomplete>
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                label='Nombres'
                placeholder='Jhon Alex'
                value={firstName}
                disabled
                onChange={e => setFirstName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                label='Apellidos'
                placeholder='Zambrana Gutierrez'
                value={lastName}
                disabled
                onChange={e => setLastName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                label='Número de Carnet'
                placeholder='3488989-B PT'
                value={ci}
                disabled
                onChange={e => setCi(e.target.value)}
              />
            </Grid>
            {/* <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                label='Fecha de Nacimiento'
                type='date'
                InputLabelProps={{shrink:true}}
                value={birthdate}
                onChange={e => setBirthdate(e.target.value)}
                
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                label='Localidad'
                placeholder='Potosí'
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                label='Dirección'
                placeholder='Av. Las Banderas'
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                label='Teléfono o Celular'
                placeholder='+591-72345785'
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                label='Email'
                placeholder='jhon123@gmail.com'
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
            <TextField
                fullWidth
                label='País'
                placeholder='Bolivia'
                value={country}
                onChange={e => setCountry(e.target.value)}
              />
            </Grid> */}
          </Fragment>
        )
      case 1:
        return (
          <Fragment key={step}>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                label='Número de Licencia'
                placeholder='10531753'
                value={numberLicence}
                onChange={e => setNumberLicence(e.target.value)}

              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                label='Fecha Emisión'
                type='date'
                value={emition}
                onChange={e => setEmition(e.target.value)}
                InputLabelProps={{shrink:true}}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                label='Fecha Vencimiento'
                type='date'
                value={expiration}
                onChange={e => setExpiration(e.target.value)}
                InputLabelProps={{shrink:true}}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                fullWidth
                label='Categoría'
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder='B'
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Card>
                <CardMedia sx={{ height: 200 }} image={front}/>
                    <Button component="label" size='large' variant="contained" 
                    sx={{width:'100%', borderTopLeftRadius:0, borderTopRightRadius:0}}
                    startIcon={<CloudUploadIcon />}
                    >
                Seleccionar Foto de Licencia frontal
                <VisuallyHiddenInput type="file" 
                onChange={handleImageFront} accept='image/*'/>
              </Button>
              {errorMessageFront && <Box style={{ color: 'red' }}>{errorMessageFront}</Box>}
              </Card>

            </Grid>
            <Grid item xs={12} sm={12}>
              <Card>
                <CardMedia sx={{ height: 200 }} image={back}/>
                    <Button component="label" size='large' variant="contained" sx={{width:'100%', borderTopLeftRadius:0, borderTopRightRadius:0}} startIcon={<CloudUploadIcon />}>
                Seleccionar Foto de Licencia trasera
                <VisuallyHiddenInput type="file"
                onChange={handleImageBack} accept='image/*'/>
              </Button>
              {errorMessageBack && <Box style={{ color: 'red' }}>{errorMessageBack}</Box>}
              </Card>

            </Grid>
          </Fragment>
        )
      default:
        return 'Unknown Step'
    }
  }

  const renderContent = () => {
    if (activeStep === steps.length) {
      return (
        <SnackbarConsecutive/>
      )
    } else {
      return (
        <form onSubmit={e => e.preventDefault()}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                {steps[activeStep].title}
              </Typography>
            </Grid>
            {getStepContent(activeStep)}
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                size='large'
                variant='outlined'
                color='secondary'
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Atras
              </Button>
              <Button size='large' variant='contained' onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Guardar' : 'Siguiente'}
              </Button>
            </Grid>
          </Grid>
        </form>
      )
    }
  }

  return (
    <Fragment>
      <StepperWrapper>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((step, index) => {
            return (
              <Step key={index}>
                <StepLabel StepIconComponent={StepperCustomDot}>
                  <div className='step-label'>
                    <div>
                      <Typography className='step-title'>{step.title}</Typography>
                    </div>
                  </div>
                </StepLabel>
              </Step>
            )
          })}
        </Stepper>
      </StepperWrapper>
      <Card sx={{ mt: 4 }}>
        <CardContent>{renderContent()}</CardContent>
      </Card>
    </Fragment>
  )
}

export default StepperAlternativeLabel
