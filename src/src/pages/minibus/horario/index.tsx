import { Box, Card, CardHeader, Grid } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { useCallback, useState } from "react"
import { useQuery } from "react-query"
import TableHeader from "src/components/tableHeader"
import { useService } from "src/hooks/useService"


const columns = [
    {
        flex:0.2,
        field:'schedule',
        headerName:'Nombre de horario',
    },
    {
        flex:0.2,
        field:'going',
        headerName:'Horario de Ida',
    },
    {
        flex:0.2,
        field:'return',
        headerName:'Horario de vuelta'
    },
    {
        flex:0.2,
        field:'details',
        headerName:'Detalles'
    },
    {
        flex:0.2,
        field:'status',
        headerName:'Estados',
    },
    {
        flex:0.2,
        field:'actions',
        headerName:'Acciones'
    }
]
const Horario = ()=>{
    const [pageSize,setPageSize]=useState<number>(10)
    const [value, setValue] = useState<string>('')
    const [hidden, setHidden] = useState<boolean>(false)
    const {Get}=useService()
    const {data,isLoading,isError} = useQuery('roads',()=>Get('/road'))
    const handleFilter = useCallback((val: string) => {
        setValue(val)
    },[])
    const toggleDrawer = () => setHidden(!hidden)
    return(
        <Grid container spacing={6} >
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Registro de horario' sx={{pb:0, '& .MuiCardHeader-title':{letterSpacing:'.15px'}}} />
                    <TableHeader 
                    value={value} 
                    handleFilter={handleFilter} 
                    toggle={toggleDrawer}  
                    placeholder='Busquedad de horarios'
                    title='Nuevo horario'
                    disable={isError || isLoading}
                    />
                    {isLoading?<Box sx={{textAlign:'center'}}>Cargando datos...</Box>:!isError?
                    <DataGrid
                    autoHeight
                    rows={data?.data}
                    columns={columns}
                    pageSize={pageSize}
                    disableSelectionOnClick
                    rowsPerPageOptions={[10,25,50]}
                    sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
                    onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
                    />:''
                    }
                </Card>
            </Grid>
        </Grid>
    )
}
export default Horario