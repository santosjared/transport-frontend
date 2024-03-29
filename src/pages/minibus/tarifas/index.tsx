import { Box, Card, CardHeader, Grid } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { useCallback, useState } from "react"
import { useQuery } from "react-query"
import AddDraw from "src/components/addDraw"
import TableHeader from "src/components/tableHeader"
import { useService } from "src/hooks/useService"
import AddTarifas from "./register"


const columns = [
    {
        flex:0.2,
        field:'rates',
        headerName:'Nombre de tarifas',
    },
    {
        flex:0.2,
        field:'createdAt',
        headerName:'Fecha de creación',
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
const Tarifas = ()=>{
    const [pageSize,setPageSize]=useState<number>(10)
    const [value, setValue] = useState<string>('')
    const [OpenAdd, setOpenAdd] = useState<boolean>(false)
    const {Get}=useService()
    const {data,isLoading,isError} = useQuery('roads',()=>Get('/road'))
    const handleFilter = useCallback((val: string) => {
        setValue(val)
    },[])
    const toggleDrawer = () => setOpenAdd(!OpenAdd)
    return(
        <Grid container spacing={6} >
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Registro de tarifas' sx={{pb:0, '& .MuiCardHeader-title':{letterSpacing:'.15px'}}} />
                    <TableHeader 
                    value={value} 
                    handleFilter={handleFilter} 
                    toggle={toggleDrawer}  
                    placeholder='Busquedad de tarifas'
                    title='Nueva tarifa'
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
            <AddDraw open={OpenAdd} toggle={toggleDrawer} title='Registro de Tarifas'>
                <AddTarifas toggle={toggleDrawer}/>
            </AddDraw>
        </Grid>
    )
}
export default Tarifas