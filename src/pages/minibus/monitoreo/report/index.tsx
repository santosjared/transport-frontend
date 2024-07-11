// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { useEffect, useState } from 'react'
import { apiService } from 'src/store/services/apiService'
// import { useService } from 'src/hooks/useService'


const AnalyticsSalesCountry = ({linadta}:{linadta:any}) => {
  // ** Hook
  const theme = useTheme()
  const [request,setRequest] = useState<number[]>([])
  const [names,setNames] = useState<string[]>([])
  const [total,setTotal] = useState<number>(0)

  // const {Get} = useService()

  const series = [
    {
      name: 'promedio',
      data: request
    }
  ]
  useEffect(()=>{
    const fetch = async()=>{
      const response = await apiService.Get('/linea/requests')
      if(response && response.data){
        const requests = response.data.result.map((data:any)=>{
          return data.request
        })
        const lineaName = response.data.result.map((data:any)=>{
          return data.name
        })
        setRequest(requests)
        setNames(lineaName)
        setTotal(response.data.total)
      }
    }
    fetch()
  },[linadta])
  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        barHeight: '60%',
        horizontal: true,
        distributed: true,
        startingShape: 'rounded'
      }
    },
    dataLabels: {
      offsetY: 8,
      style: {
        fontWeight: 500,
        fontSize: '0.875rem'
      }
    },
    grid: {
      strokeDashArray: 8,
      borderColor: theme.palette.divider,
      xaxis: {
        lines: { show: true }
      },
      yaxis: {
        lines: { show: false }
      },
      padding: {
        top: -18,
        left: 21,
        right: 33,
        bottom: 10
      }
    },
    colors: [
      hexToRGBA(theme.palette.primary.light, 1),
      hexToRGBA(theme.palette.success.light, 1),
      hexToRGBA(theme.palette.warning.light, 1),
      hexToRGBA(theme.palette.info.light, 1),
      hexToRGBA(theme.palette.error.light, 1)
    ],
    legend: { show: false },
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: names,
      labels: {
        formatter: val => `${Number(val) / 1000}k`,
        style: {
          fontSize: '0.875rem',
          colors: theme.palette.text.disabled
        }
      }
    },
    yaxis: {
      labels: {
        align: theme.direction === 'rtl' ? 'right' : 'left',
        style: {
          fontWeight: 600,
          fontSize: '0.875rem',
          colors: theme.palette.text.primary
        }
      }
    }
  }

  return (
    <Card>
      <CardHeader
        title='Lineas más buscados'
        subheader={`Total de lineas ${total}`}
        subheaderTypographyProps={{ sx: { lineHeight: 1.429 } }}
        titleTypographyProps={{ sx: { letterSpacing: '0.15px' } }}
      />
      <CardContent
        sx={{
          p: '0 !important',
          '& .apexcharts-canvas .apexcharts-yaxis-label': { fontSize: '0.875rem', fontWeight: 600 },
          '& .apexcharts-canvas .apexcharts-xaxis-label': { fontSize: '0.875rem', fill: theme.palette.text.disabled },
          '& .apexcharts-data-labels .apexcharts-datalabel': {
            fontWeight: 500,
            fontSize: '0.875rem',
            fill: theme.palette.common.white
          }
        }}
      >
        <ReactApexcharts type='bar' height={538} series={series} options={options} />
      </CardContent>
    </Card>
  )
}

export default AnalyticsSalesCountry
