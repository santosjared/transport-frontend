// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => [
  {
    title: 'Home',
    path: '/home',
    icon: 'mdi:home-outline',
  },
  {
    title:'Registro de Chofer',
    path:'/Registro-choferes',
    icon:'healthicons:truck-driver'
  },
  {
    title: 'Microbus',
    path: '/Micros',
    icon: 'mdi:bus',
  },
  {
    title:'Rutas',
    path:'/second-page',
    icon:'material-symbols:fork-right'
  },
  {
    title:'Horarios de salida',
    path:'/minibus/firts/',
    icon:'ic:twotone-log-out'
  },
]

export default navigation
