import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { Box, Button, Checkbox, FormControl, FormHelperText } from '@mui/material';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
// import { useService } from 'src/hooks/useService';
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
import RenderImg from '../cuntomphoto';
import { apiService } from 'src/store/services/apiService';

interface Props {
  toggle: () => void
  open:boolean
  dataEdit:any
  page:number,
  pageSize:number
}

const defaultErrors = {
  name: '',
  road: '',
  horario: '',
  rate: '',
  buses: ''
}
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const EditLinea = ({ toggle, dataEdit, page,pageSize, open }: Props) => {

  const [onSelectRuote, setOnSelectRoute] = useState<any[]>([])
  const [name, setName] = useState<string>('')
  const [onSelectHorario, setOnSelectHorario] = useState<any>([])
  const [onSelectTarifa, setOnSelectTarifa] = useState<any>([])
  const [onSelectBus, setOnSelectBus] = useState<any>([])
  const [formErrors,setFormErrors] = useState(defaultErrors)
  const [busData,setBusdata] = useState<any[]>([])
  const [isLoading,setIsLoading] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  // const {Get } = useService()

  const storeHorario = useSelector((state:RootState)=>state.horario)
  const storeTarifa = useSelector((state:RootState)=>state.tarifa)
  const storeRuta = useSelector((state:RootState)=>state.road)
  useEffect(()=>{
    if(open){
      setName(dataEdit.name)
      setOnSelectRoute(dataEdit.road)
      setOnSelectHorario(dataEdit.horario)
      setOnSelectTarifa(dataEdit.rate)
      setOnSelectBus(dataEdit.buses)
      dispatch(fetchBusDta())
      dispatch(fetchTarifaDta())
      dispatch(fetchHorarioDta())
      dispatch(fetchRutaDta())
    }
  },[dataEdit, open])
  useEffect(() => {
    if(open){
    const fetch = async () => {
      const response = await apiService.Get('/linea/allBusNotAsigned')
      const combinedResult = response.data.result.concat(dataEdit.buses);
      setBusdata(combinedResult)
    }
    fetch();
  }
  }, [dataEdit,open])
  const handleClose = () => {
    handleReset()
  }
  const onSubmit = async (e:FormEvent) =>{
    e.preventDefault()
    setIsLoading(true)
     const IdBuses = onSelectBus.map((bus: any) => bus._id)
      const IdHorario = onSelectHorario.map((horario: any) => horario._id)
      const IdTarifa = onSelectTarifa.map((tarifa: any) => tarifa._id)
      const IdRoad = onSelectRuote.map((road:any)=>road._id)
      const data = {
        name: name,
        road: IdRoad,
        horario: IdHorario,
        rate: IdTarifa,
        buses: IdBuses
      }
      try {
        const response = await dispatch(updateLinea({data:data,id:dataEdit.id, filtrs:{skip: page * pageSize, limit: pageSize}}))
        if (response.payload.success) {
          Swal.fire({ title: '¡Éxito!', text: 'Datos actualizados exitosamente', icon: "success" });
          handleReset()
        } else {
          if (response.payload.data) {
            const { data } = response.payload
            formErrors.buses = data.buses
            formErrors.horario = data.horario
            formErrors.name = data.name
            formErrors.rate = data.rate
            formErrors.road = data.road
            setFormErrors(formErrors)
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
    formErrors.buses = ''
    formErrors.horario = ''
    formErrors.name = ''
    formErrors.rate = ''
    formErrors.road = ''
    setFormErrors(formErrors)
    setOnSelectRoute([])
    setOnSelectHorario([])
    setOnSelectTarifa([])
    setOnSelectBus([])
    setBusdata([])

    toggle()
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
            error={Boolean(formErrors.name)}
            helperText={formErrors.name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        <FormControl fullWidth >
          <Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={storeRuta.data}
            disableCloseOnSelect
            value={onSelectRuote}
            onChange={(e, value) => {setOnSelectRoute(value); setFormErrors({...formErrors,road:''})}}
            getOptionLabel={(option: any) => option.name}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            renderOption={(props, option: any, { selected }) => (
              <li {...props}>
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
              <TextField {...params} autoComplete='off' label='Asignar rutas' />
            )}
          />
          {formErrors.road && <FormHelperText sx={{ color: 'error.main' }}>{formErrors.road}</FormHelperText>}
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
          {formErrors.horario && <FormHelperText sx={{ color: 'error.main' }}>{formErrors.horario}</FormHelperText>}
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
          {formErrors.rate && <FormHelperText sx={{ color: 'error.main' }}>{formErrors.rate}</FormHelperText>}
        </FormControl>
        <FormControl fullWidth >
          <Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={busData}
            disableCloseOnSelect
            value={onSelectBus}
            onChange={(e, value) => setOnSelectBus(value)}
            getOptionLabel={(option: any) => `${option.trademark} - ${option.plaque}`}
            isOptionEqualToValue={(option, value) => option.plaque === value.plaque}
            renderOption={(props, option: any, { selected }) => (
              <li key={option.id}{...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {<RenderImg url={option}/>}
                {option.trademark} - {option.plaque}
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} autoComplete='off' label='Asignar minibus' />
            )}
          />
          {formErrors.buses && <FormHelperText sx={{ color: 'error.main' }}>{formErrors.buses}</FormHelperText>}
        </FormControl>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button size='large' variant='outlined' color='secondary' onClick={handleClose} startIcon={<CancelIcon />}>
            Cancelar
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
