import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { useQuery } from 'react-query';
import { useService } from 'src/hooks/useService';

export interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
  handleHidden:()=>void
  setId:(id:string) =>void
}

const ListRoad = (props: SimpleDialogProps) =>{
  const { onClose, open , handleHidden, setId} = props;
  
  const {Get} = useService()
  const {data,isError} = useQuery('roads',()=>Get('/road'))

  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = (value: string) => {
    onClose();
    setId(value)
    handleHidden()
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Seleccione la ruta</DialogTitle>
      <List sx={{ pt: 0 }}>
        {data?.data.map((list: any, index: any) => (
          <ListItem disableGutters key={list.id}>
            <ListItemButton onClick={() => handleListItemClick(list.id)}>
              <ListItemText primary={list.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}
export default ListRoad
