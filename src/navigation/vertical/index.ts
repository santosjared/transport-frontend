// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Home',
      path: '/home',
      icon: 'mdi:home-outline',
    },
    {
      title:'Monitoreo',
      path:'/minibus/monitoreo',
      icon:'eos-icons:monitoring'
    },
    {
      title:'Registro de usuarios',
      path:'/minibus/users',
      icon:'mdi:users'
    },
    {
      title: 'Registro de microbuses',
      path: '/minibus/bus',
      icon: 'mdi:bus'
    },
    {
      title: 'Registro de lineas',
      path: '/minibus/lineas',
      icon: 'tabler:list-letters'
    },
    {
      title:'Registro de rutas',
      path:'/minibus/road',
      icon:'material-symbols:fork-right'
    },
    {
      title:'Registro de tarifas',
      path:'/minibus/tarifas',
      icon:'fluent:money-hand-20-regular'
    },
    {
      title:'Registro de horarios',
      path:'/minibus/horario',
      icon:'game-icons:notebook'
    },
    {
      title:'Conectar Dispositivo GPS',
      path:'/minibus/gps',
      icon:'mdi:cellphone-gps'
    }
    // {
    //   title:'Registro de Rutas y Tarifas',
    //   icon:'material-symbols:fork-right',
    //   children:[
    //     {
    //       title:'Rutas',
    //       path:'/minibus/road'
    //     },
    //     {
    //       title:'Tarifas',
    //       path:'/minibus/tarifas'
    //     }
    //   ]
    // },
    // {
    //   title:'Horarios',
    //   path:'/minibus/firts',
    //   icon:'ic:twotone-log-out',
    //   children:[
    //     {
    //       title:'Registro de horarios',
    //       path:'/minibus/firts'
    //     },
    //     {
    //       title:'Semanal',
    //       path:'/minibus/weeks'
    //     },
    //     {
    //       title:'Diario',
    //       path:'/minibus/days'
    //     }
    //   ]
    // },
    // {
    //   title:'Faltas y Sanciones',
    //   path:'#',
    //   icon:'icomoon-free:hammer2'
    // },
    // {
    //   title:'test',
    //   path:'/second-page',
    // }
    // {
    //   title: 'Home',
    //   path: '/home',
    //   icon: 'mdi:home-outline',
    // },
    // {
    //   title: 'Rutas',
    //   path: '/second-page',
    //   icon: 'mdi:email-outline',
    // },
    // {
    //   path: '/acl',
    //   action: 'read',
    //   subject: 'acl-page',
    //   title: 'Access Control',
    //   icon: 'mdi:shield-outline',
    // }
  ]
}

export default navigation
