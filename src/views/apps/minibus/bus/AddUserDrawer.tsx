import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import Drawer from "@mui/material/Drawer"
import { styled } from '@mui/material/styles'
import { Controller, useForm } from "react-hook-form"
import Box, {BoxProps} from '@mui/material/Box'
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import Icon from "src/@core/components/icon"
import StepperAlternativeLabel from "../../forms/choferes"
import FormControl from "@mui/material/FormControl"
import TextField from "@mui/material/TextField"
import FormHelperText from "@mui/material/FormHelperText"
import Button from "@mui/material/Button"
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { addBus } from 'src/store/apps/bus';
import { Autocomplete, Card, CardMedia, Grid } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import { useService } from 'src/hooks/useService';
import { useMutation, useQuery } from 'react-query';

interface SidebarAddUserType {
    open: boolean
    toggle: () => void
  }
  interface BusData {
    trademark:string
    model:string
    type:string
    plaque:string    
    numberSeating:number
    fuel:string
    photo:File | null
  }
  const defaultValues = {
    trademark: '',
    model: '',
    type: '',
    plaque: '',    
    numberSeating: Number(''),
    fuel: '',
    photo: null
  }
  const Header = styled(Box)<BoxProps>(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(3, 4),
    justifyContent: 'space-between',
    backgroundColor: theme.palette.background.default
  }))
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
  const SidebarAddUser = (props:SidebarAddUserType) =>{
    const [errorMessage,setErrorMessage] = useState('')
    const [photo,setPhoto] = useState<string>('/images/default/licence.png')
    const [file, setFile]= useState<File|null>(null)
    const [onSelectGps,setOnselectGpas] = useState<any>(null)
    const {open, toggle} = props
    const {Get} = useService()
    const {data}=useQuery('divice',()=>Get('/divice'))
    console.log(onSelectGps)
    const dispatch = useDispatch<AppDispatch>()
    const {
      reset,
      setValue,
      control,
      handleSubmit,
      formState:{errors}
    } = useForm<BusData>({
      defaultValues,
    })
    
    const handleChangeImage = (e:ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files?.[0] || null
        setValue('photo',file)
        if(file?.type.startsWith('image/'))
        {
          const imgURL = URL.createObjectURL(file);
          setPhoto(imgURL);
          setErrorMessage('')
        }else{
          setErrorMessage('Por favor, selecciona un archivo de imagen válido.')
          setPhoto('/images/default/licence.png')
        }
      }
    }
    const{Post}=useService()
    const onSubmit = async (data:BusData) => {
      dispatch(addBus(data))
      toggle()
      reset()
    }
    const handleClose = () => {
      setPhoto('/images/default/licence.png')
      toggle()
    }
    const handleImage =(event:ChangeEvent<HTMLInputElement>)=>{
      const file = event.target.files?.[0]
      if(file?.type.startsWith('image/')){
        const imgURL = URL.createObjectURL(file);
        setPhoto(imgURL);
        setErrorMessage('')
      }else{
        setErrorMessage('Por favor, selecciona un archivo de imagen válido.')
        setPhoto('/images/default/licence.png')
      }
    }
    return(
        <Drawer
        open={open}
        anchor='right'
        variant='temporary'
        onClose={handleClose}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 600 } } }}
        >
          <Header>
            <Typography variant='h6'>Registrar Microbus</Typography>
            <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
              <Icon icon='mdi:close' fontSize={20} />
              </IconButton>
          </Header>
          <Box sx={{ p: 5 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth sx={{mb:6}}>
              <Card>
                <CardMedia sx={{ height: 200 }} image={photo}/>
                <Button component="label" size='large' variant="contained" 
                sx={{width:'100%', borderTopLeftRadius:0, borderTopRightRadius:0}}
                startIcon={<CloudUploadIcon />}>
                Seleccionar Foto de MicroBus
                <Controller
                name='photo'
                control={control}
                render={({field:{value,onChange}})=>(<VisuallyHiddenInput 
                  type="file"
                  onChange={handleChangeImage} 
                  accept='image/*'/>)}
                  />
                  </Button>
              {errorMessage && <Box style={{ color: 'red' }}>{errorMessage}</Box>}
              </Card>
              </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='trademark'
              control={control}
              rules={{ required: true }}
              render={({field:{value,onChange}}) => (
                <TextField
                  value={value}
                  label='Marca'
                  onChange={onChange}
                  placeholder='Nissan'
                  error={Boolean(errors.trademark)}
                />
              )}
            />
            {errors.trademark && <FormHelperText sx={{ color: 'error.main' }}></FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='model'
              control={control}
              rules={{ required: true }}
              render={({field:{value,onChange}}) => (
                <TextField
                value={value}
                  label='Modelo'
                  onChange={onChange}
                  placeholder='2006'
                  error={Boolean(errors.model)}
                />
              )}
            />
            {errors.model && <FormHelperText sx={{ color: 'error.main' }}></FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='type'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                value={value}
                  label='Tipo de Vehículo'
                  onChange={onChange}
                  placeholder='Civilian'
                  error={Boolean(errors.type)}
                />
              )}
            />
            {errors.type && <FormHelperText sx={{ color: 'error.main' }}></FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='plaque'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                value={value}
                  label='Placa del Vehículo'
                  onChange={onChange}
                  placeholder='XYZ 897'
                  error={Boolean(errors.plaque)}
                />
              )}
            />
            {errors.plaque && <FormHelperText sx={{ color: 'error.main' }}></FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='numberSeating'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <TextField
                value={value}
                  type='number'
                  label='Cantidad de asientos'
                  onChange={onChange}
                  placeholder='32'
                  error={Boolean(errors.numberSeating)}
                />
              )}
            />
            {errors.numberSeating && <FormHelperText sx={{ color: 'error.main' }}></FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
              <Autocomplete 
              options={data?.data as Array<{name:string}>}
              getOptionLabel={(option)=>option.name}
              onChange={(event,value)=> setOnselectGpas(value)}
              renderInput={(params)=> (
                <TextField
                {...params}
                label='Buscar rutas y paradas'
                InputProps={{
                  ...params.InputProps,
                  startAdornment:(
                    <>
                    {params.InputProps.startAdornment}
                    </>
                  )
                }}
                />

              )}
              sx={{borderTopLeftRadius:0, borderTopRightRadius:0}}
              >

              </Autocomplete>
            </FormControl>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }} startIcon={<SaveIcon/>}>
              Guaradar
            </Button>
            <Button size='large' variant='outlined' color='secondary' onClick={handleClose} startIcon={<CancelIcon/>}>
              Cancel
            </Button>
          </Box>
        </form>
          </Box>
        </Drawer>
    )
  }
  export default SidebarAddUser
