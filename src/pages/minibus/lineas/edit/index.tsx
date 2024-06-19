import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { Box, Button, Checkbox, FormControl } from '@mui/material';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useService } from 'src/hooks/useService';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useDispatch } from 'react-redux';
import { AppDispatch, RootState} from 'src/store';
import { useSelector } from 'react-redux';
import { fetchData as fetchBusDta } from 'src/store/apps/bus';
import { fetchData as fetchTarifaDta} from 'src/store/apps/tarifa';
import { fetchData as fetchHorarioDta} from 'src/store/apps/horario';
import { fetchData as fetchRutaDta } from 'src/store/apps/road';
import { addLinea, updateLinea } from 'src/store/apps/linea';
import { isImage } from 'src/utils/verificateImg';
import getConfig from 'src/configs/environment'
import Swal from 'sweetalert2';

interface Props {
  toggle: () => void
  dataEdit:any
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const EditLinea = ({ toggle, dataEdit }: Props) => {

  const [onSelectRuote, setOnSelectRoute] = useState<any>(null)
  const [name, setName] = useState<string | null>(null)
  const [onSelectHorario, setOnSelectHorario] = useState<any>([])
  const [onSelectTarifa, setOnSelectTarifa] = useState<any>([])
  const [onSelectBus, setOnSelectBus] = useState<any>([])
  const [nameError,setNameError] = useState('')
  const [busData,setBusdata] = useState<any[]>([])

  const [isLoading,setIsLoading] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const {Get } = useService()

  const storeHorario = useSelector((state:RootState)=>state.horario)
  const storeTarifa = useSelector((state:RootState)=>state.tarifa)
  const storeRuta = useSelector((state:RootState)=>state.road)
  useEffect(()=>{
    if(dataEdit){
      setName(dataEdit.name)
      setOnSelectRoute(dataEdit.road)
      setOnSelectHorario(dataEdit.horario)
      setOnSelectTarifa(dataEdit.rate)
      setOnSelectBus(dataEdit.buses)
    }
  },[dataEdit])
  useEffect(() => {
    if(dataEdit){
    const fetch = async () => {
      const response = await Get('/linea/allBusNotAsigned')
      const combinedResult = response.data.result.concat(dataEdit.buses);
      setBusdata(combinedResult)
    }
    fetch();
    dispatch(fetchBusDta())
    dispatch(fetchTarifaDta())
    dispatch(fetchHorarioDta())
    dispatch(fetchRutaDta())
  }
  }, [dataEdit])
  const handleClose = () => {
    handleReset()
  }
  const onSubmit = async (e:FormEvent) =>{
    e.preventDefault()
    setIsLoading(true)
     const IdBuses = onSelectBus.map((bus: any) => bus._id)
      const IdHorario = onSelectHorario.map((horario: any) => horario._id)
      const IdTarifa = onSelectTarifa.map((tarifa: any) => tarifa._id)
      const data = {
        name: name,
        road: onSelectRuote? onSelectRuote._id : '',
        horario: IdHorario,
        rate: IdTarifa,
        buses: IdBuses
      }
      try {
        const response = await dispatch(updateLinea({data:data,id:dataEdit.id}))
        if (response.payload.success) {
          Swal.fire({ title: '¡Éxito!', text: 'Datos actualizados exitosamente', icon: "success" });
          handleReset()
        } else {
          if (response.payload.data) {
            const { data } = response.payload
            setNameError(data.name)
          } else { Swal.fire({ title: '¡Error!', text: 'ocurio un error al guardar los datos', icon: "error" }); handleReset() }
        }
      } catch (error) {
        Swal.fire({ title: '¡Error!', text: 'ocurio un error al guardar los datos', icon: "error" });
        handleReset()
      } finally {
        setIsLoading(false)
      }  
  }
  const handleReset = () => {
    setName('')
    setNameError('')
    setOnSelectRoute(null)
    setOnSelectHorario([])
    setOnSelectTarifa([])
    setOnSelectBus([])
    toggle()
  }
  const renderImg = (url: any) => {
    // const img = isImage(`${getConfig().backendURI}${url}`)
    // img.then((result)=>{
    //   if (result) {
    //     return (
    //       <Box sx={{ display: 'flex', border: 'solid 1px #E0E0E0', borderRadius: 0.5 }}>
    //       <img src={`${getConfig().backendURI}${url}`} height={35} width={35} style={{ borderRadius: 5 }}></img>
    //     </Box>
    //     )
    //   } else {
    //     return ''
    //   }
    // })
    return( <Box sx={{ display: 'flex', border: 'solid 1px #E0E0E0', borderRadius: 0.5 }}>
    <img src={`${getConfig().backendURI}${url}`} height={35} width={35} style={{ borderRadius: 5 }} alt='B'onError={()=>{}}></img>
  </Box>)
  }
  return (
    <> {busData.length ===0 || storeHorario.isLoading || storeTarifa.isLoading || storeRuta.isLoading ? 'Cargando...' :
    <form onSubmit={onSubmit}>
      <Stack spacing={8} sx={{ border: 1, padding: 5, borderRadius: 1 }}>
        <FormControl fullWidth>
          <TextField label='Linea'
            placeholder='110'
            value={name}
            autoComplete='off'
            error={Boolean(nameError)}
            helperText={nameError}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        <FormControl fullWidth >
          <Autocomplete
            options={storeRuta.data}
            getOptionLabel={(option: any) => option.name}
            onChange={(event, value) => setOnSelectRoute(value)}
            value={onSelectRuote}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            renderInput={(params) => (
              <TextField
                {...params}
                label='Asignar ruta'
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
        <FormControl fullWidth >
          <Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={storeHorario.data}
            value={onSelectHorario}
            disableCloseOnSelect
            onChange={(e, value) => setOnSelectHorario(value)}
            getOptionLabel={(option: any) => option.name}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            renderOption={(props, option: any, { selected }) => (
              <li key={option.id}{...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.name}
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} autoComplete='off' label='Asignar horario' />
            )}
          />
        </FormControl>
        <FormControl fullWidth >
          <Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={storeTarifa.data}
            disableCloseOnSelect
            value={onSelectTarifa}
            onChange={(e, value) => setOnSelectTarifa(value)}
            getOptionLabel={(option: any) => option.name}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            renderOption={(props, option: any, { selected }) => (
              <li key={option.id}{...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.name}
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} autoComplete='off' label='Asignar tarifa' />
            )}
          />
        </FormControl>
        <FormControl fullWidth >
          <Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={busData}
            disableCloseOnSelect
            value={onSelectBus}
            onChange={(e, value) => setOnSelectBus(value)}
            getOptionLabel={(option: any) => option.trademark}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            renderOption={(props, option: any, { selected }) => (
              <li {...props} key={option.id}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {renderImg(option.photo)}
                {option.trademark} - {option.plaque}
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} autoComplete='off' label='Asignar minibus' />
            )}
          />
        </FormControl>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button size='large' variant='outlined' color='secondary' onClick={handleClose} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }} startIcon={<SaveIcon />}>
            Guardar
          </Button>
        </Box>
      </Stack>
      </form>
    }  </>
  );
}

export default EditLinea