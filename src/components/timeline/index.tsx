import { styled } from '@mui/material/styles'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import Typography from '@mui/material/Typography'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline from '@mui/lab/Timeline'
import CustomChip from 'src/@core/components/mui/chip'
import type { TimelineProps } from '@mui/lab/Timeline'
import { Box } from '@mui/material'

import RenderImg from 'src/pages/minibus/lineas/cuntomphoto'
import {RenderPhoto, RenderPhotoBus} from '../cuntomImg'

// Styled Timeline component
const Timeline = styled(MuiTimeline)<TimelineProps>({
  paddingLeft: 0,
  paddingRight: 0,
  '& .MuiTimelineItem-root': {
    width: '100%',
    '&:before': {
      display: 'none'
    }
  }
})
interface Props {
  buses:any[]
  linea:any[]
}

const TimelineFilled = ({buses}:Props) => {
  return (
    <Timeline>
      {buses.map((bus, index)=>(
        <TimelineItem key={bus.id}>
        <TimelineSeparator>
          <TimelineDot color={index == 0 ?'success':index === 1?'info':'primary'} />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
            <Box sx={{display:'flex', justifyContent:'space-between'}}>
            <Typography className='font-medium' color='text.primary'>
              linea {bus.linea}
            </Typography>
            <Box>
              <Typography variant='body2'>Tiempo de llegada </Typography>
            <Typography variant='caption'>{bus.time? `${bus.time} aproximadamente`:'0 min aproximadamente'}</Typography>
            <Box><CustomChip
            skin='light'
            size='small'
            label={bus.status}
            color={bus.status === 'Acercandose'? 'success' : bus.status === 'cerca de ti'?'info':'error'}
            sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
          /></Box>
            </Box>
            </Box>
          <Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <RenderImg url={bus}/>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' , ml:3}}>
            <Typography variant='inherit'>{`${bus.trademark}`}</Typography>
            <Typography variant='body2'>placa: {bus.plaque}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <RenderPhoto data={bus.userId}/>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: theme => `${theme.palette.text.secondary}` }}>{`${bus.userId.name} ${bus.userId.lastName}`}</Typography>
            </Box>
          </Box>

          </Box>
        </TimelineContent>
      </TimelineItem>
      ))
      }
    </Timeline>
  )
}

export default TimelineFilled
