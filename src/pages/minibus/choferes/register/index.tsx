import { Autocomplete, Avatar, Box, Button, Card, CardMedia, FormControl, Grid, TextField, Typography } from "@mui/material"
import { ChangeEvent, useState } from "react"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useService } from "src/hooks/useService";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { styled } from '@mui/material/styles';
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'

interface Props {
    toggle: () => void;
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

const AddChofer = ({ toggle }: Props) => {
    const [selectUser, setSelectUser] = useState<any>()
    const [category, setCategory] = useState('')
    const [dateEmition, setDateEmition] = useState('')
    const [dateExpire, setDateExpire] = useState('')
    const [errorMessageFront, setErrorMessageFront] = useState('')
    const [errorMessageBack, setErrorMessageBack] = useState('')
    const [front, setFront] = useState<string>('/images/default/licence.png')
    const [back, setBack] = useState<string>('/images/default/licence.png')
    const [licenceFront, setLicenceFront]= useState<File |null>(null)
    const [licenceBack, setLicenceBack]= useState<File |null>(null)

    const { Get, Post} = useService()
    const { data } = useQuery('users', () => Get('/users'))
    const queryClient = useQueryClient()
    const mutation = useMutation((Data: object) => Post('/choferes', Data), {
        onSuccess: () => {
            queryClient.invalidateQueries('choferes')
        }
    })
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
    const handleSaveClick = () =>{
        const data={
            userId:selectUser? selectUser.id:'',
            category:category,
            dateEmition:dateEmition,
            dateExpire:dateExpire,
            licenceFront:licenceFront,
            licenceBack:licenceBack
        }
        mutation.mutate(data)
        toggle()
    }
    return (<Box>
        <fieldset style={{ border: '1.5px solid #E0E0E0', borderRadius: 10, paddingTop: 20 }}>
            <legend style={{ textAlign: 'center' }}><Typography variant='subtitle2'>Agregar licencia de conducir</Typography></legend>
            <FormControl fullWidth sx={{ mb: 6 }}>
                <Autocomplete
                    options={data?.data}
                    getOptionLabel={(options: any) => options.name}
                    onChange={(event, value) => setSelectUser(value)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label='Seleccionar usuario'
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
                >
                </Autocomplete>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
                <TextField
                    label='Categoria'
                    placeholder='A'
                    onChange={e => setCategory(e.target.value)}
                    value={category}
                />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
                <TextField
                    label='Fecha de emición'
                    onChange={e => setDateEmition(e.target.value)}
                    value={dateEmition}
                    type='date'
                    InputLabelProps={{ shrink: true }}
                />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 6 }}>
                <TextField
                    label='Fecha de expiración'
                    onChange={e => setDateExpire(e.target.value)}
                    value={dateExpire}
                    type='date'
                    InputLabelProps={{ shrink: true }}
                />
            </FormControl>
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button size='large' variant='outlined' color='secondary' onClick={()=>toggle()} startIcon={<CancelIcon />}>
                            Cancel
                        </Button>
                        <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }} onClick={handleSaveClick}
                            startIcon={<SaveIcon />}>
                            Guardar
                        </Button>
                    </Box>
        </fieldset>
    </Box>)
}
export default AddChofer;