import { Box, Card, CardHeader, FormControl, FormHelperText, TextField } from "@mui/material"
import { Controller } from "react-hook-form"

const Register = ()=>{

    return(
        <Box>
        <FormControl fullWidth sx={{mb:6}}>
            <TextField
            label='Nombre' 
            placeholder='gps 012'
            />
        </FormControl>
        <FormControl fullWidth sx={{mb:6}}>
            <TextField
            label='Marca' 
            value={'Galaxy A34 5G'}
            />
        </FormControl>
        <FormControl fullWidth sx={{mb:6}}>
            <TextField
            label='Modelo' 
            value={'SM-A315Y5QA'}
            />
        </FormControl>
        </Box>
    )
}
export default Register