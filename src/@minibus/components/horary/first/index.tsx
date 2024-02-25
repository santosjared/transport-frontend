import { DataGrid } from '@mui/x-data-grid'


const columns = [
    {
        flex:0.2,
        minWidth:230,
        field:'fullname',
        headerName:'Nombre de Horario'
    }
]
const table = () =>{
    return(
        <DataGrid
        autoHeight
        rows={[]}
        columns={columns}
        >

        </DataGrid>
    )
}