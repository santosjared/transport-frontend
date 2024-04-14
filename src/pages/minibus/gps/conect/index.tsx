import { Alert, Box, Card, CardContent, CardHeader, Divider, FormControl,Link, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import getConfig from 'src/configs/environment'
import { useService } from "src/hooks/useService"

interface Props {
    toggle:boolean
}
const Conect = ({toggle}:Props)=>{
    const {Get} = useService()
    const [code,setCode] = useState<number>(0)
    useEffect(()=>{
        if(toggle){
            const getCode = async()=>{
                const data = await Get('/code')
                setCode(data.data.code)
            }
            getCode()
        }
    },[toggle])
    return(
        <Card>
            <CardHeader title='Conectar con dispositivo GPS'/>
            <Divider/>
            <CardContent>
                Para conectar con el dispositivo GPS debe generar un apk para android o una aplicación para dispositivos IOS. 
                Luego instale en su dispositivo móvil y llene los campos con los datos de abajo.
                <Alert severity='warning'><strong>Nota:</strong> Para instalar las apliacacioones en su dispositivo 
                    debe tener activado para instalar fuentes desconocidos.</Alert>  
            </CardContent>
            <Divider/>
            <CardContent>
                <Box>Código</Box>
                <Box sx={{border:'1px solid #9c9c9c', p:2, m:2, ml:0, mb:0, borderRadius:0.5}}>{code}</Box>
                <Box sx={{fontSize:10, mb:2, color:'#2196f3'}}>El código expira en 5 min</Box>
                <Box>Servidor</Box>
                <Box sx={{border:'1px solid #9c9c9c', p:2, m:2, ml:0, borderRadius:0.5, mb:0}}>{getConfig().backendURI}</Box>
            </CardContent>
        </Card>
    )
}
export default Conect