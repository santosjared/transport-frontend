import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import FormControl from "@mui/material/FormControl"
import TextField from "@mui/material/TextField"
import FormHelperText from "@mui/material/FormHelperText"
import Button from "@mui/material/Button"
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { Autocomplete, Avatar, Card, CardMedia, IconButton, InputLabel, List, ListItem, MenuItem, Select, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useService } from 'src/hooks/useService';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { markersBus } from 'src/utils/markerBus';
import { typesBus } from 'src/utils/typeBus';

import { useDropzone } from 'react-dropzone'

interface Props {
    toggle: () => void
}
interface BusData{
    trademark: string;
    model: number;
    type: string;
    plaque: string;
    cantidad: number;
    photo: File | null;
    ruat:File | null;
}
const defaultData = {
    trademark:'',
    model: '',
    type: '',
    plaque: '',
    cantidad: '',
    photo:  null,
    ruat: null,
    otherMarker:'',
    otherType:''
}
const defaultErrors = {
    trademark:'',
    model: '',
    type: '',
    plaque: '',
    cantidad: '',
    photo:  null,
    ruat: null,
    otherMarker:'',
    otherType:''
}
type FileProp = {
    name: string
    type: string
    size: number
  }
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
const RegisterBus = ({ toggle }: Props) => {
    const [formBus,setFormBus] = useState(defaultData)
    const [formErrors,setFormErrors] = useState(defaultErrors)
    const [errorMessage, setErrorMessage] = useState('')
    const [photo, setPhoto] = useState<string>('/images/default/licence.png')
    const [file, setFile] = useState<File | null>(null)
    const [trademark, setTrademark] = useState<string | null>(null)
    const [model, setModel] = useState<string | null>(null)
    const [type, setType] = useState<string | null>(null)
    const [plaque, setPlaque] = useState<string | null>('')
    const [cantidad, setCantidad] = useState<string | null>(null)
    const [files, setFiles] = useState<File[]>([])

    const { Post } = useService()

    const queryClient = useQueryClient()
    const mutation = useMutation((Data: object) => Post('/bus', Data), {
        onSuccess: () => {
            queryClient.invalidateQueries('bus')
        }
    })
    const handleSaveOnclick = () => {
        const data = {
            trademark: trademark,
            model: model,
            type: type,
            plaque: plaque,
            cantidad: cantidad,
            photo: file
        }
        mutation.mutate(data)
        handleReset();
        toggle();
    }
    const handleReset = () => {
        setTrademark(null)
        setModel(null)
        setType(null)
        setPlaque(null)
        setCantidad(null)
        setFile(null)
        setPhoto('/images/default/licence.png')
    }
    const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files?.[0] || null
            setFile(file)
            if (file?.type.startsWith('image/')) {
                const imgURL = URL.createObjectURL(file);
                setPhoto(imgURL);
                setErrorMessage('')
            } else {
                setErrorMessage('Por favor, selecciona un archivo de imagen válido.')
                setPhoto('/images/default/licence.png')
            }
        }
    }
    const handleClose = () => {
        handleReset();
        toggle();

    }
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles: File[]) => {
          setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
        }
      })
    const renderFilePreview = (file: FileProp) => {
        if (file.type.startsWith('image')) {
          return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file as any)} />
        } else {
          return <i className='ri-file-text-line' />
        }
      }
    const handleRemoveAllFiles = () => {
        setFiles([])
      }
      const handleRemoveFile = (file: FileProp) => {
        const uploadedFiles = files
        const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name)
    
        setFiles([...filtered])
      }
    
      const fileList = files.map((file: FileProp) => (
        <ListItem key={file.name}>
          <div className='file-details'>
            <div className='file-preview'>{renderFilePreview(file)}</div>
            <div>
              <Typography className='file-name'>{file.name}</Typography>
              <Typography className='file-size' variant='body2'>
                {Math.round(file.size / 100) / 10 > 1000
                  ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
                  : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
              </Typography>
            </div>
          </div>
          <IconButton onClick={() => handleRemoveFile(file)}>
            <i className='ri-close-line text-xl' />
          </IconButton>
        </ListItem>
      ))
    return (
        <Box sx={{ border: '1px solid #EEEDED', borderRadius: 1, p: 5 }}>
            <FormControl fullWidth sx={{ mb: 6 }}>
                <Card>
                    <CardMedia sx={{ height: 200 }} image={photo} />
                    <Button component="label" size='large' variant="contained"
                        sx={{ width: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
                        startIcon={<CloudUploadIcon />}>
                        Seleccionar Foto de MicroBus
                        <VisuallyHiddenInput
                            autoComplete='off'
                            type="file"
                            onChange={handleChangeImage}
                            accept='image/*' />
                    </Button>
                    {errorMessage && <FormHelperText sx={{ color: 'error.main' }}>{errorMessage}</FormHelperText>}
                </Card>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
                <InputLabel id="demo-simple-select-label">Marca</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="trademark"
                    value={"formUser.gende"}
                    label="Marca"
                    //onChange={handleGenderOnchange}
                    autoComplete='off'
                >
                    {markersBus.map((mark) => (<MenuItem
                        value={mark}
                        key={mark}
                    >{mark}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
                <TextField
                    value={trademark}
                    label='Otra Marca'
                    placeholder='Nissan'
                    autoComplete='off'
                    onChange={(e) => setTrademark(e.target.value)}
                />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
                <InputLabel id="demo-simple-select-label">Tipo de Vehículo</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="trademark"
                    value={"formUser.gende"}
                    label="Tipo de Vehículo"
                    //onChange={handleGenderOnchange}
                    autoComplete='off'
                >
                    {typesBus.map((mark) => (<MenuItem
                        value={mark}
                        key={mark}
                    >{mark}</MenuItem>))}
                </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
                <TextField
                    value={type}
                    label='Otro tipo de vehículo'
                    placeholder='Civilian'
                    autoComplete='off'
                    onChange={(e) => setType(e.target.value)}
                />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
                <TextField
                    value={model}
                    label='Modelo'
                    placeholder='2006'
                    autoComplete='off'
                    onChange={(e) => setModel(e.target.value)}
                />
                {<FormHelperText sx={{ color: 'error.main' }}></FormHelperText>}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
                <TextField
                    value={plaque}
                    label='Placa del Vehículo'
                    placeholder='XYZ 897'
                    autoComplete='off'
                    onChange={(e) => setPlaque(e.target.value)}
                />
                {<FormHelperText sx={{ color: 'error.main' }}></FormHelperText>}
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
                <TextField
                    value={cantidad}
                    type='number'
                    label='Cantidad de asientos'
                    placeholder='32'
                    autoComplete='off'
                    onChange={(e) => setCantidad(e.target.value)}
                />
                {<FormHelperText sx={{ color: 'error.main' }}></FormHelperText>}
            </FormControl>
            <>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <div className='flex items-center flex-col'>
          <Avatar variant='rounded' className='bs-12 is-12 mbe-9'>
            <i className='ri-upload-2-line' />
          </Avatar>
          <Typography variant='h4' className='mbe-2.5'>
            Drop files here or click to upload.
          </Typography>
          <Typography color='text.secondary'>
            Drop files here or click{' '}
            <a href='/' onClick={e => e.preventDefault()} className='text-textPrimary no-underline'>
              browse
            </a>{' '}
            thorough your machine
          </Typography>
        </div>
      </div>
      {files.length ? (
        <>
          <List>{fileList}</List>
          <div className='buttons'>
            <Button color='error' variant='outlined' onClick={handleRemoveAllFiles}>
              Remove All
            </Button>
            <Button variant='contained'>Upload Files</Button>
          </div>
        </>
      ) : null}
    </>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button size='large' variant='outlined' color='secondary' onClick={handleClose} startIcon={<CancelIcon />}>
                    Cancel
                </Button>
                <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }} onClick={handleSaveOnclick} startIcon={<SaveIcon />}>
                    Guaradar
                </Button>
            </Box>
        </Box>
    )
}
export default RegisterBus
