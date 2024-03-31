import {styled} from '@mui/material/styles'
import GpsNotFixedIcon from '@mui/icons-material/GpsNotFixed';
import { Box} from '@mui/material';

interface Props {
    setCenter:(cooordenate:[lat:number,lng:number])=>void;
    setZoom:(zoom:number)=>void
}
const Locale = styled(Box)(({ theme })=>({
    width:40,
    height:40,
    backgroundColor:theme.palette.primary.contrastText,
    padding:5,
    zIndex:1001,
    borderRadius:50,
    position:'absolute',  
    transform: 'translateY(300%)',
    left:theme.spacing(2),
    border:'solid 1.5px',
    '&:hover':{
        cursor:'pointer',
    },
    '& .MuiSvgIcon-root':{
        color:theme.palette.secondary.dark,
        fontSize:27
    }
}))
const Location = ({setCenter,setZoom}:Props)=>{
    const handleClick = ()=>{
        navigator.geolocation.getCurrentPosition((position)=>{
            setCenter([position.coords.latitude, position.coords.longitude])
            setZoom(position.coords.accuracy)
        })
    }
    return (
    <Locale onClick={handleClick}><GpsNotFixedIcon/></Locale>)
}
export default Location