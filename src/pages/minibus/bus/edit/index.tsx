import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import FormControl from "@mui/material/FormControl"
import TextField from "@mui/material/TextField"
import FormHelperText from "@mui/material/FormHelperText"
import Button from "@mui/material/Button"
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/store';
import { Card, CardMedia, Grid,InputLabel, MenuItem,Select, SelectChangeEvent, Typography, makeStyles } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDropzone } from 'react-dropzone'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import {updateBus } from 'src/store/apps/bus';
import Swal from 'sweetalert2';
import { isImage } from 'src/utils/verificateImg';
import getConfig from 'src/configs/environment';
import { apiService } from 'src/store/services/apiService';

interface Props {
    toggle: () => void
    data:any
    page:number
    pageSize:number
}
interface BusData {
    trademark: string;
    model: number;
    type: string;
    plaque: string;
    cantidad: number;
    status: string;
    photo: File | null;
    ruat: File | null;
    otherMarker: string;
    otherType: string;
    otherState: string;
}
const defaultData = {
    trademark: '',
    model: 1990,
    type: '',
    plaque: '',
    cantidad: 16,
    status: '',
    photo: null,
    ruat: null,
    otherMarker: '',
    otherType: '',
    otherState: ''
}
const defaultErrors = {
    trademark: '',
    model: '',
    type: '',
    plaque: '',
    cantidad: '',
    status: '',
    photo: '',
    ruat: '',
}
const DragAndDrog = styled(Box)(({ theme }) => ({
    border: `2px dashed #ababab`,
    borderRadius: theme.spacing(1),
    textAlign: 'center',
    cursor: 'pointer',
    height: 70,
    padding: 5
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

const EditBus = ({ toggle ,data, page, pageSize}: Props) => {
    const [formBus, setFormBus] = useState<BusData>(defaultData)
    const [formErrors, setFormErrors] = useState(defaultErrors)
    const [photo, setPhoto] = useState<string>('/images/default/licence.png')
    const [file, setFile] = useState<File | null>(null)
    const [ruatFile, setRuatFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false)
    const [busMarker,setBusMarker] = useState<any[]>([])
    const [busType,setBusType] = useState<any[]>([])
    const [busStatus,setBusStatus] = useState<any[]>([])

    useEffect(() => {
      const fetch = async () => {
        const response = await apiService.Get('/busmarker');
        setBusMarker(response.data);
      };
      fetch();
    }, [toggle]);

    useEffect(() => {
      const fetch = async () => {
        const response = await apiService.Get('/bustype');
        setBusType(response.data);
      };
      fetch();
    }, [toggle]);

    useEffect(() => {
      const fetch = async () => {
        const response = await apiService.Get('/busstatus');
        setBusStatus(response.data);
      };
      fetch();
    }, [toggle]);
    useEffect(()=>{
        if(data){
            const fetch = async()=>{
                const busData = {
                    trademark: data.trademark?.name,
                    model: data.model,
                    type: data.type?.name,
                    plaque: data.plaque,
                    cantidad: data.cantidad,
                    status: data.status?.name,
                    photo: data.photo,
                    ruat: data.ruat,
                    otherMarker: data.trademark,
                    otherType: data.type,
                    otherState: ''
                }
                const img = await isImage(`${getConfig().backendURI}${data.photo}`)
                if(img){
                    setPhoto(`${getConfig().backendURI}${data.photo}`)
                }
                setFormBus(busData)
            }
            fetch()
        }
    },[data,toggle])

    const dispatch = useDispatch<AppDispatch>()
    const { getRootProps, getInputProps, isDragAccept } = useDropzone({
        accept: { 'application/pdf': ['.pdf'] },
        onDrop: (acceptedFiles: File[]) => {
            const firstAcceptedFile = acceptedFiles[0];
            if (firstAcceptedFile && firstAcceptedFile.type === 'application/pdf') {
                formErrors.ruat = ''
                setRuatFile(firstAcceptedFile);
            } else {
                formErrors.ruat = 'solo se admite archivo pdf'
            }
        }
    });
    const handleChangeFields = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormBus({
            ...formBus,
            [name]: value
        })
        setFormErrors({
            ...formErrors,
            [name]: ''
        })
    }
    const handleChangeSelects = (e: SelectChangeEvent) => {
        const { name, value } = e.target
        setFormBus({
            ...formBus,
            [name]: value
        })
        setFormErrors({
            ...formErrors,
            [name]: ''
        })
    }
    const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files?.[0] || null
            setFile(file)
            if (file?.type.startsWith('image/')) {
                const imgURL = URL.createObjectURL(file);
                setPhoto(imgURL);
                formErrors.photo = ''
            } else {
                formErrors.photo = 'Por favor, selecciona un archivo de imagen válido.'
                setPhoto('/images/default/licence.png')
            }
        }
    }
    const handleReset = () => {
        setFormErrors(defaultErrors)
        setFormBus(defaultData)
        setFile(null)
        setRuatFile(null)
        setPhoto('/images/default/licence.png')
        toggle();
    }
    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true)
        if (formBus.trademark === 'Otro') {
          formBus.trademark = formBus.otherMarker
      }
      if (formBus.type === 'Otro') {
          formBus.type = formBus.otherType
      }
      if (formBus.status === 'Otro'){
          formBus.status = formBus.otherState
      }
      if(file){
        formBus.photo = file
      }
      if(ruatFile){
        formBus.ruat = ruatFile
      }
        setFormBus(formBus)
        try {
            const response = await dispatch(updateBus({data:formBus,id:data.id,filters:{skip: page * pageSize, limit: pageSize}}))
            if (response.payload.success) {
                Swal.fire({ title: '¡Éxito!', text: 'Datos actualizados exitosamente', icon: "success" });
                handleReset()
            } else {
                if (response.payload.data) {
                    const { data } = response.payload
                    formErrors.cantidad = data.cantidad
                    formErrors.model = data.model
                    formErrors.photo = data.photo
                    formErrors.plaque = data.plaque
                    formErrors.ruat = data.ruat
                    formErrors.trademark = data.trademark
                    formErrors.type = data.type
                    formErrors.status = data.status
                } else { Swal.fire({ title: '¡Error!', text: 'ocurio un error al actualizar los datos', icon: "error" }); handleReset() }
            }
        } catch (error) {
            Swal.fire({ title: '¡Error!', text: 'ocurio un error al alctualizar los datos', icon: "error" });
            handleReset()
        } finally {
            setIsLoading(false)
            setFormErrors(formErrors)
        }
    }
    return (
        <Box sx={{ border: '1px solid #EEEDED', borderRadius: 1, p: 5 }}>
            <form onSubmit={onSubmit}>
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
                        {formErrors.photo && <FormHelperText sx={{ color: 'error.main' }}>{formErrors.photo}</FormHelperText>}
                    </Card>
                </FormControl>
                <FormControl fullWidth sx={{ mb: 6 }}>
                    <InputLabel id="demo-simple-select-label">Marca</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="trademark"
                        value={formBus.trademark}
                        label="Marca"
                        error={Boolean(formErrors.trademark)}
                        onChange={handleChangeSelects}
                        autoComplete='off'
                    >
                        {busMarker.map((mark) => (<MenuItem
                            value={mark.name}
                            key={mark.id}
                        >{mark.name}</MenuItem>))}
                    </Select>
                    {formErrors.trademark && <FormHelperText sx={{ color: 'error.main' }}>{formErrors.trademark}</FormHelperText>}
                </FormControl>
                {formBus.trademark == 'Otro' &&
                    <FormControl fullWidth sx={{ mb: 6 }}>
                        <TextField
                            name='otherMarker'
                            value={formBus.otherMarker}
                            label='Otra Marca'
                            placeholder='Nissan'
                            error={Boolean(formErrors.trademark)}
                            helperText={formErrors.trademark}
                            autoComplete='off'
                            onChange={handleChangeFields}
                        />
                    </FormControl>}
                <FormControl fullWidth sx={{ mb: 6 }}>
                    <InputLabel id="demo-simple-select-label">Tipo de Vehículo</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="type"
                        value={formBus.type}
                        label="Tipo de Vehículo"
                        error={Boolean(formErrors.type)}
                        onChange={handleChangeSelects}
                        autoComplete='off'
                    >
                        {busType.map((type) => (<MenuItem
                            value={type.name}
                            key={type.id}
                        >{type.name}</MenuItem>))}
                    </Select>
                    {formErrors.type && <FormHelperText sx={{ color: 'error.main' }}>{formErrors.type}</FormHelperText>}
                </FormControl>
                {formBus.type === 'Otro' &&
                    <FormControl fullWidth sx={{ mb: 6 }}>
                        <TextField
                            value={formBus.otherType}
                            name='otherType'
                            label='Otro tipo de vehículo'
                            placeholder='Civilian'
                            error={Boolean(formErrors.type)}
                            helperText={formErrors.type}
                            autoComplete='off'
                            onChange={handleChangeFields}
                        />
                    </FormControl>}
                <FormControl fullWidth sx={{ mb: 6 }}>
                    <TextField
                        name='model'
                        label='Modelo'
                        type='number'
                        placeholder='2006'
                        autoComplete='off'
                        value={formBus.model}
                        error={Boolean(formErrors.model)}
                        helperText={formErrors.model}
                        onChange={handleChangeFields}
                    />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 6 }}>
                    <TextField
                        label='Placa del Vehículo'
                        name='plaque'
                        placeholder='XYZ 897'
                        autoComplete='off'
                        value={formBus.plaque}
                        error={Boolean(formErrors.plaque)}
                        helperText={formErrors.plaque}
                        onChange={handleChangeFields}
                    />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 6 }}>
                    <TextField
                        name='cantidad'
                        type='number'
                        label='Cantidad de asientos'
                        placeholder='32'
                        value={formBus.cantidad}
                        error={Boolean(formErrors.cantidad)}
                        helperText={formErrors.cantidad}
                        autoComplete='off'
                        onChange={handleChangeFields}
                    />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 6 }}>
                    <InputLabel id="demo-simple-select-label">Estado de Vehículo</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="status"
                        value={formBus.status}
                        label="Estado de Vehículo"
                        error={Boolean(formErrors.status)}
                        onChange={handleChangeSelects}
                        autoComplete='off'
                    >
                        {busStatus.map((status) => (<MenuItem
                            value={status.name}
                            key={status.id}
                        >{status.name}</MenuItem>))}
                    </Select>
                </FormControl>
                {formBus.status === 'Otro' ? <FormControl fullWidth sx={{ mb: 6 }}>
                    <TextField
                        name='otherState'
                        label='Otro estado'
                        placeholder='Otro estado'
                        value={formBus.otherState}
                        error={Boolean(formErrors.status)}
                        helperText={formErrors.status}
                        autoComplete='off'
                        onChange={handleChangeFields}
                    />
                </FormControl> : ''}
                <Grid container justifyContent="center" alignItems="center">
                    <Grid item xs={12}>
                        <DragAndDrog {...getRootProps()} sx={{ mb: 0, backgroundColor: isDragAccept ? '#C0C0C0' : '#F0F0F0', }}>
                            <input {...getInputProps()} />
                            {ruatFile ? <Card sx={{ backgroundColor: '#F9F9F9' }}>
                                <Typography className='file-name'><PictureAsPdfIcon color='error' sx={{ position: 'relative', top: 10 }} /> {ruatFile.name}</Typography>
                                <Typography className='file-size' variant='body2'>
                                    {Math.round(ruatFile.size / 100) / 10 > 1000
                                        ? `${(Math.round(ruatFile.size / 100) / 10000).toFixed(1)} mb`
                                        : `${(Math.round(ruatFile.size / 100) / 10).toFixed(1)} kb`}
                                </Typography>
                            </Card> :!ruatFile && formBus.ruat?
                            <Typography className='file-name'><PictureAsPdfIcon color='error' sx={{ position: 'relative', top: 10 }} />
                            {formBus.ruat.toString().substring(formBus.ruat.toString().lastIndexOf('/')+1)}</Typography>:
                            <><Typography variant='subtitle2'>Subir documento pdf de Ruat</Typography>
                                <CloudUploadIcon /></>}

                        </DragAndDrog>
                        {formErrors.ruat && <FormHelperText sx={{ color: 'error.main' }}>{formErrors.ruat}</FormHelperText>}
                    </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6 }}>
                    <Button size='large' variant='outlined' color='secondary' onClick={handleReset} startIcon={<CancelIcon />}>
                        Cancelar
                    </Button>
                    <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }} startIcon={<SaveIcon />}>
                        Guaradar
                    </Button>
                </Box>
            </form>
        </Box>
    )
}
export default EditBus
