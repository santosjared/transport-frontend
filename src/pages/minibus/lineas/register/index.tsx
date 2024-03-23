import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

import { Controller, useForm } from "react-hook-form"
import Box from '@mui/material/Box'

import FormControl from "@mui/material/FormControl"
import TextField from "@mui/material/TextField"
import FormHelperText from "@mui/material/FormHelperText"
import Button from "@mui/material/Button"
import { useService } from 'src/hooks/useService';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Autocomplete } from '@mui/material';
import { useState } from 'react';

interface Props {
    toggle: () => void
  }
interface Data {
    name:string
    routs:string
    schedule:string
  }
  const defaultValues = {
    name: '',
    routs: '',
    schedule: '',
  }
  const AddLinea = ({toggle}:Props) =>{
    const [onSelect, setOnSelect] = useState<any>(null)
    const{Post,Get}=useService()
    const queryClient = useQueryClient()
    const mutation = useMutation((Data:object)=>Post('/linea',Data),{
      onSuccess:()=>{
        queryClient.invalidateQueries('lineas');
      }
    })
    const routs = useQuery('road',()=>Get('/road'))
    const schedules = useQuery('schedules',()=>Get('/horario'))
    const {
      reset,
      control,
      handleSubmit,
      formState:{errors}
    } = useForm<Data>({
      defaultValues,
    })
    
    const onSubmit = async (data:Data) => {
      mutation.mutate({data})
      toggle()
      reset()
    }
    const handleClose = () =>{
      toggle()
    }
    const Routs = ()=>{
      if(routs.isError || routs.isLoading)return [{name:''}]
      return routs.data?.data
    }
    const Schulede = ()=>{
      if(schedules.isError|| schedules.isLoading) return [{name:''}]
      return schedules.data?.data
    }
    return(
          <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <Controller
              name='name'
              control={control}
              rules={{ required: true }}
              render={({field:{value,onChange}}) => (
                <TextField
                  value={value}
                  label='Nombre de la linea'
                  onChange={onChange}
                  placeholder='Linea 110'
                  error={Boolean(errors.name)}
                />
              )}
            />
            {errors.name && <FormHelperText sx={{ color: 'error.main' }}></FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
              <Autocomplete 
              options={Routs()}
              getOptionLabel={Routs().name}
              onChange={(event,value)=> setOnSelect(value)}
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
            <FormControl fullWidth sx={{ mb: 6 }}>
              <Autocomplete 
              options={Schulede()}
              getOptionLabel={Schulede().name}
              onChange={(event,value)=> setOnSelect(value)}
              renderInput={(params)=> (
                <TextField
                {...params}
                label='Bucar Horarios'
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
              Guardar
            </Button>
            <Button size='large' variant='outlined' color='secondary' onClick={handleClose} startIcon={<CancelIcon/>}>
              Cancel
            </Button>
          </Box>
        </form>
    )
  }
  export default AddLinea
