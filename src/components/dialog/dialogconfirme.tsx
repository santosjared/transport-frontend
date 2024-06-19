// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

type Props = {
  open: boolean; // Indica si el modal está abierto o no
  setOpen: (val: boolean) => void; // Función para cambiar el estado de open
  
  // Función opcional para manejar la confirmación
  setConfirme?: (val: boolean) => void;

  title: string; // Título del modal
  message?: string; // Mensaje opcional del modal
  icon: string; // Icono a mostrar en el modal
  buttoConfirmed?: string; // Texto para el botón de confirmación (opcional)
  buttonCancel?: string; // Texto para el botón de cancelación (opcional)
  variantConfirmed?: 'text' | 'contained' | 'outlined'; // Variante del botón de confirmación (opcional)
  variantCancel?: 'text' | 'contained' | 'outlined'; // Variante del botón de cancelación (opcional)
  colorConfirmed?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'; // Color del botón de confirmación (opcional)
  colorCancel?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'; // Color del botón de cancelación (opcional)
}

const AltertComponent = (props: Props) => {
  const { open, setOpen, setConfirme,title,message,icon,buttoConfirmed,
    buttonCancel,variantCancel,variantConfirmed,colorCancel,colorConfirmed } = props
  const handleClose = () => setOpen(false)
  const handleConfirmation = () => {
    handleClose()
    if(setConfirme){setConfirme(true)}
  }
  return (
    <>
      <Dialog fullWidth open={open} onClose={handleClose} sx={{ '& .MuiPaper-root': { width: '100%', maxWidth: 512 } }}>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <Box sx={{ mb: 2, 
              maxWidth: '85%',
              textAlign: 'center', 
              '& svg': { mb: 2, 
              color:icon === 'success'?'success.main':icon === 'error'?'error.main':icon === 'warning'?'warning.main':'info.main' } }}>
              <Icon icon={icon === 'success'?'mdi:check-circle-outline':
              icon === 'error'?'mdi:close-circle-outline':
              icon === 'warning'?'mdi:alert-circle-outline':'mdi:information-slab-circle-outline'} fontSize='5.5rem' />
              <Typography variant='h4' sx={{ color: 'text.secondary' }}>
                {title}
              </Typography>
            </Box>
            {message?<Typography>{message}</Typography>:''}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
       {buttoConfirmed? 
       <Button variant={variantConfirmed?variantConfirmed:'contained'} color={colorConfirmed}onClick={handleConfirmation}>
          {buttoConfirmed}
        </Button>:''}
        {buttonCancel?<Button variant={variantCancel?variantCancel:'outlined'} color={colorCancel?colorCancel:'secondary' }onClick={handleClose}>
          {buttonCancel}
        </Button>:''}
        </DialogActions>
      </Dialog>
    </>  )
}

export default AltertComponent
