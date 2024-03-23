import { Box, Card, CardHeader, Grid } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { useCallback, useState } from "react"
import { useQuery } from "react-query"
import AddDraw from "src/components/addDraw"
import TableHeader from "src/components/tableHeader"
import { useService } from "src/hooks/useService"


const columns = [
    {
        flex:0.2,
        field:'name',
        headerName:'Nombre',
    },
    {
        flex:0.2,
        field:'phone',
        headerName:'Numero de Chip',
    },
    {
        flex:0.2,
        field:'mark',
        headerName:'Marca',
    },
    {
        flex:0.2,
        field:'conect',
        headerName:'Estado de Conexion'
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
const Gps = ()=>{
    const [pageSize,setPageSize]=useState<number>(10)
    const [value, setValue] = useState<string>('')
    const [openAdd, setOpenAdd] = useState<boolean>(false)
    const {Get}=useService()
    const {data,isLoading,isError} = useQuery('roads',()=>Get('/road'))
    const handleFilter = useCallback((val: string) => {
        setValue(val)
    },[])
    const toggleDrawer = () => setOpenAdd(!openAdd)
    return(
        <Grid container spacing={6} >
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Registro de gps' sx={{pb:0, '& .MuiCardHeader-title':{letterSpacing:'.15px'}}} />
                    <TableHeader 
                    value={value} 
                    handleFilter={handleFilter} 
                    toggle={toggleDrawer}  
                    placeholder='Busquedad de gps'
                    title='Conectar nuevo gps'
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
            <AddDraw open={openAdd} toggle={toggleDrawer} title='Registro de gps'/>
        </Grid>
    )
}
export default Gps