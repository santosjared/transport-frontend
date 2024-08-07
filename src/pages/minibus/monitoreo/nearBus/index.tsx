import { Box, CircularProgress, Dialog, DialogContent, Fade, FadeProps, IconButton, Typography } from "@mui/material"
import { ReactElement, Ref, forwardRef, useEffect, useRef, useState } from "react";
import Icon from "src/@core/components/icon"
import TimelineFilled from "src/components/timeline";
import useGeolocation from "src/hooks/useGeoLocation";
import { useSocket } from "src/hooks/useSocket";

interface Props{
  open:boolean
  toggle:()=>void
  linea:any[]
}

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});
const NearBus = ({open,toggle, linea}:Props) =>{
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [buses, setBuses] = useState([]);
  const busesRef = useRef(buses);
  const { location, error } = useGeolocation();
  const { socket } = useSocket();

  useEffect(() => {
    busesRef.current = buses;
  }, [buses]);

  useEffect(() => {
    let intervalId:any = null;

    const handleBusesEvent = (data:any) => {
      setIsLoading(false);
      if (data.message) {
        setMessage(data.message);
      }
      if (data.buses) {
        setBuses(data.buses);
      }
    };

    if (socket) {
      socket.on('buses', handleBusesEvent);

      if (open) {
          setIsLoading(true);
          setMessage('');
          setBuses([]);

          const emitNearBus = () => {
            socket.emit('nearbus', { location, busesOld: busesRef.current });
          };

          emitNearBus();
          intervalId = setInterval(emitNearBus, 10000);
      }

      return () => {
        socket.off('buses', handleBusesEvent);
        if (intervalId) {
          setBuses([])
          clearInterval(intervalId);
        }
      };
    }
  }, [open, error, location, socket]);
  return(
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
        {isLoading &&<Box sx={{display:'flex', justifyContent:'center'}}>
          <CircularProgress />
        </Box>}
        {message&&<Box sx={{display:"flex", justifyContent:'center'}}>
          <Typography variant="subtitle2">{message}</Typography>
          </Box>}
        {buses && <TimelineFilled buses={buses} linea={linea}/>}
        </DialogContent>
        </Dialog>
        )
}
export default NearBus
