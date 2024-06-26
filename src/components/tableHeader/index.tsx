import { FormControl } from "@mui/material"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import { ReactNode } from "react"

interface TableHeaderProps {
    value: string
    toggle: () => void
    handleFilter: (val: string) => void
    placeholder:string
    title:string
    children?:ReactNode
  }
  
  const TableHeader = (props: TableHeaderProps) => {
    // ** Props
    const { handleFilter, toggle, value, placeholder, title,children } = props
  
    return (
      <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap',justifyContent: 'space-between' }}>
          {children}
          <Button sx={{ mb: 2 }} onClick={toggle} variant='contained'>
            {title}
          </Button>
      
      </Box>
    )
  }
  
  export default TableHeader