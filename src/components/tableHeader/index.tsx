import { FormControl } from "@mui/material"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"

interface TableHeaderProps {
    value: string
    toggle: () => void
    handleFilter: (val: string) => void
    placeholder:string
    title:string
    disable:boolean
  }
  
  const TableHeader = (props: TableHeaderProps) => {
    // ** Props
    const { handleFilter, toggle, value, placeholder, title,disable } = props
  
    return (
      <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap',justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap'}}>
          <FormControl sx={{mb:2}}>
          <TextField
            size='small'
            value={value}
            sx={{mr:2}}
            placeholder={placeholder}
            onChange={e => handleFilter(e.target.value)}
            disabled={disable}
          />
          </FormControl>
          <Button sx={{ mb: 2 }} variant='contained' disabled={disable}>
            BUSCAR
          </Button>
          </Box>
          <Button sx={{ mb: 2 }} onClick={toggle} variant='contained' disabled={disable}>
            {title}
          </Button>
      
      </Box>
    )
  }
  
  export default TableHeader