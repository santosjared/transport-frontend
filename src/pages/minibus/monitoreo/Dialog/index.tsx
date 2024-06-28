import { Box, Dialog, DialogContent, Divider, Fade, FadeProps, FormControl, IconButton, List, ListItem, ListItemText, TextField, Typography } from "@mui/material";
import { Fragment, ReactElement, Ref, forwardRef, useState } from "react";
import Icon from "src/@core/components/icon";

interface openOptins {
  all:string;
  roadm:string;
  roadr:string;
  busnear:string;
  rate:string;
  horario:string;
}
interface Props {
  open: boolean;
  toggle: () => void;
  data: any;
  options:keyof openOptins
  handleSelectionLine: (id: string, key: keyof openOptins) => void;
}

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});

const ListLinea = ({ open, toggle, data, handleSelectionLine, options }: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = data
    ?.filter((value: any) =>
      `linea ${value.name}`.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 10);

  return (
    <Dialog
      fullWidth
      open={open}
      maxWidth="sm"
      scroll="body"
      onClose={toggle}
      TransitionComponent={Transition}
    >
      <DialogContent
        sx={{ px: { xs: 8, sm: 15 }, py: { xs: 8, sm: 12.5 }, position: "relative" }}
      >
        <IconButton
          size="small"
          onClick={toggle}
          sx={{ position: "absolute", right: "1rem", top: "1rem" }}
        >
          <Icon icon="mdi:close" />
        </IconButton>
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="h5" sx={{ mb: 3, lineHeight: "2rem" }}>
            Lista de lineas
          </Typography>
        </Box>
        <FormControl fullWidth sx={{ mb: 6 }}>
          <TextField
            label="Buscar Lineas"
            value={searchTerm}
            onChange={handleSearch}
          />
        </FormControl>
        <Typography variant="h6">{`${filteredData?.length} Lineas`}</Typography>
        <List dense sx={{ py: 4 }}>
          {filteredData?.map((value: any) => (
            <Fragment key={value.id}>
              <ListItem
                sx={{
                  pb: 2,
                  pt: 0,
                  pl: 5,
                  pr: 0,
                  display: "flex",
                  flexWrap: "wrap",
                  ".MuiListItem-container:not(:last-child) &": { mb: 4 },
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.08)" },
                  cursor: "pointer"
                }}
                onClick={() => handleSelectionLine(value, options)}
              >
                <ListItemText
                  primary={`linea ${value.name}`}
                  sx={{
                    m: 0,
                    "& .MuiListItemText-primary, & .MuiListItemText-secondary": {
                      lineHeight: "1.25rem"
                    }
                  }}
                />
              </ListItem>
              <Divider />
            </Fragment>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default ListLinea;
