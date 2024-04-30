import { Avatar, Box, Button, FormControl, Grid,TextField, Typography } from "@mui/material"
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { ChangeEvent, useState } from "react"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useMutation, useQueryClient } from "react-query";
import { useService } from "src/hooks/useService";

interface Props {
    toggle: () => void;
}

const genders = [
    'Hombre',
    'Mujer',
    'Otro'
]
const AddUser = ({ toggle }: Props) => {

    const [self, setSelf] = useState('/images/avatars/2.png')
    const [profile, setProfile] = useState<File | null>(null)
    const [name, setName] = useState('')
    const [lastname, setLastname] = useState('')
    const [gender, setGender] = useState('')
    const [ci, setCi] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [contry, setContry] = useState('')
    const [city, setCity] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const { Post } = useService()
    const queryClient = useQueryClient()
    const mutation = useMutation((Data: object) => Post('/users', Data), {
        onSuccess: () => {
            queryClient.invalidateQueries('users')
        }
    })
    const handleProfileOnchage = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files?.[0] || null
            setProfile(file)
            if (file?.type.startsWith('image/')) {
                const imgURL = URL.createObjectURL(file);
                setSelf(imgURL);
                setErrorMessage('')
            } else {
                setErrorMessage('Por favor, selecciona un archivo de imagen válido.')
                setSelf('/images/avatars/2.png')
            }
        }
    }
    const handleGenderOnchange = (event: SelectChangeEvent) => {
        setGender(event.target.value as string);
    }
    const handleSaveOnclick = () => {
        const data = {
            name: name,
            lastName: lastname,
            gender: gender,
            ci: ci,
            phone: phone,
            address: address,
            contry: contry,
            city: city,
            profile:profile,
        }
        mutation.mutate(data)
        toggle()
    }
    return (<Box>
        <fieldset style={{ border: '1.5px solid #E0E0E0', borderRadius: 10, paddingTop: 20 }}>
            <legend style={{ textAlign: 'center' }}><Typography variant='subtitle2'>Agregar Nuevo Usuario</Typography></legend>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                        <Avatar
                            alt='chofer'
                            src={self}
                            sx={{ width: 100, height: 100, backgroundColor: '#E0E0E0', border: 'solid 1px #E0E0E0' }} />
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <label htmlFor="upload-image" style={{ cursor: 'pointer' }}>
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
                        </Box>
                    </label>
                    <input
                        id="upload-image"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleProfileOnchage}
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth sx={{ mb: 6 }}>
                        <TextField
                            label='Nombres'
                            placeholder='Juan Carlos'
                            onChange={e => setName(e.target.value)}
                            value={name}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth sx={{ mb: 6 }}>
                        <TextField
                            label='Apellidos'
                            placeholder='Benitez Lopez'
                            onChange={e => setLastname(e.target.value)}
                            value={lastname}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth sx={{ mb: 6 }}>
                        <InputLabel id="demo-simple-select-label">Género</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={gender}
                            label="Género"
                            onChange={handleGenderOnchange}>
                            {genders.map((gender) => (<MenuItem
                            value={gender}
                                key={gender}
                            >{gender}</MenuItem>))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth sx={{ mb: 6 }}>
                        <TextField
                            label='Ci'
                            placeholder='3456762-a'
                            onChange={e => setCi(e.target.value)}
                            value={ci}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth sx={{ mb: 6 }}>
                        <TextField
                            label='Celular'
                            placeholder='+591-72381722'
                            onChange={e => setPhone(e.target.value)}
                            value={phone}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth sx={{ mb: 6 }}>
                        <TextField
                            label='Dirección'
                            placeholder='Av. Las banderas'
                            onChange={e => setAddress(e.target.value)}
                            value={address}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth sx={{ mb: 6 }}>
                        <TextField
                            label='Nacionalidad'
                            placeholder='Bolivia'
                            onChange={e => setContry(e.target.value)}
                            value={contry}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth sx={{ mb: 6 }}>
                        <TextField
                            label='Localidad'
                            placeholder='Potosí'
                            onChange={e => setCity(e.target.value)}
                            value={city}
                        />
                    </FormControl>
                </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button size='large' variant='outlined' color='secondary' onClick={() => toggle()} startIcon={<CancelIcon />}>
                    Cancel
                </Button>
                <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }} onClick={handleSaveOnclick} startIcon={<SaveIcon />}>
                    Guardar
                </Button>
            </Box>
        </fieldset>
    </Box>)
}
export default AddUser;