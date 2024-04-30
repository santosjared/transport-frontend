import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { Box, Button, Checkbox, FormControl } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useService } from 'src/hooks/useService';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

interface Props {
  toggle: () => void
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const AddLinea = ({ toggle }: Props) => {

  const [onSelectRuote, setOnSelectRoute] = useState<any>(null)
  const [name, setName] = useState<string | null>(null)
  const [onSelectHorario, setOnSelectHorario] = useState<any>([])
  const [onSelectTarifa, setOnSelectTarifa] = useState<any>([])
  const [onSelectBus, setOnSelectBus] = useState<any>([])

  const { Get, Post } = useService()
  const routs = useQuery('road', () => Get('/road'))
  const horario = useQuery('horario', () => Get('/horario'))
  const tarifa = useQuery('tarifa', () => Get('/tarifa'))
  const bus = useQuery('bus', () => Get('/bus'))

  const queryClient = useQueryClient()
  const mutation = useMutation((Data: object) => Post('/linea', Data), {
    onSuccess: () => {
      queryClient.invalidateQueries('linea')
    }
  })

  React.useEffect(() => {
    if (mutation.isError) {
      console.log(mutation.error)
    }
  }, [mutation.error])

  const handleClose = () => {
    toggle()
    handleReset()
  }
  const handleSaveOnclick = () => {
    if (name) {
      const IdBuses = onSelectBus.map((bus: any) => bus.id)
      const IdHorario = onSelectHorario.map((horario: any) => horario.id)
      const IdTarifa = onSelectTarifa.map((tarifa: any) => tarifa.id)
      const data = {
        name: name,
        route: onSelectRuote? onSelectRuote.id : '',
        horario: IdHorario,
        tarifa: IdTarifa,
        buses: IdBuses
      }
      mutation.mutate(data)
      if (mutation.isSuccess) {
        toggle()
        handleReset()
      }
    }
  }
  const handleReset = () => {
    setName(null)
    setOnSelectRoute(null)
    setOnSelectHorario([])
    setOnSelectTarifa([])
    setOnSelectBus([])
  }
  return (
    <> {routs.isLoading || horario.isLoading || tarifa.isLoading || bus.isLoading ? 'loadin...' :
      <Stack spacing={8} sx={{ border: 1, padding: 5, borderRadius: 1 }}>
        <FormControl fullWidth>
          <TextField label='Nombre de la linea'
            placeholder='Linea 110'
            value={name}
            autoComplete='off'
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        <FormControl fullWidth >
          <Autocomplete
            options={routs.data?.data}
            getOptionLabel={(option: any) => option.name}
            onChange={(event, value) => setOnSelectRoute(value)}
            value={onSelectRuote}
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
            options={horario.data?.data}
            value={onSelectHorario}
            disableCloseOnSelect
            onChange={(e, value) => setOnSelectHorario(value)}
            getOptionLabel={(option: any) => option.name}
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
              <TextField {...params} autoComplete='off' label='Asignar horario' />
            )}
          />
        </FormControl>
        <FormControl fullWidth >
          <Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={tarifa.data?.data}
            disableCloseOnSelect
            value={onSelectTarifa}
            onChange={(e, value) => setOnSelectTarifa(value)}
            getOptionLabel={(option: any) => option.name}
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
              <TextField {...params} autoComplete='off' label='Asignar tarifa' />
            )}
          />
        </FormControl>
        <FormControl fullWidth >
          <Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={bus.data?.data}
            disableCloseOnSelect
            value={onSelectBus}
            onChange={(e, value) => setOnSelectBus(value)}
            getOptionLabel={(option: any) => option.trademark}
            renderOption={(props, option: any, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
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
          <Button size='large' type='submit' variant='contained' sx={{ mr: 3 }} onClick={handleSaveOnclick} startIcon={<SaveIcon />}>
            Guardar
          </Button>
        </Box>
      </Stack>
    }  </>
  );
}

export default AddLinea
