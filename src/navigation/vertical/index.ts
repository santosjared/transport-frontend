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
      title:'Choferes',
      path:'/minibus/choferes',
      icon:'healthicons:truck-driver',
      children:[{
        title:'Lista de Choferes',
        path:'/minibus/choferes'
      },
      {
        title:'Licencias de Conducir',
        path:'/minibus/licence'
      }
    ]
    },
    {
      title: 'Microbus',
      path: '/minibus/bus',
      icon: 'mdi:bus'
    },
    {
      title:'Lineas',
      path:'/second-page',
      icon:'material-symbols:fork-right',
      children:[
        {
          title:'Registro de lineas',
          path:'/linea'
        },
        {
          title:'Registro de rutas',
          path:'/minibus/road'
        },
        {
          title:'Registro de pasajes',
          path:'pasajes'
        }
      ]
    },
    {
      title:'Horarios',
      path:'/minibus/firts',
      icon:'ic:twotone-log-out',
      children:[
        {
          title:'Registro de horarios',
          path:'/minibus/firts'
        },
        {
          title:'Semanal',
          path:'/minibus/weeks'
        },
        {
          title:'Diario',
          path:'/minibus/days'
        }
      ]
    },
    {
      title:'Faltas y Sanciones',
      path:'#',
      icon:'icomoon-free:hammer2'
    },
    {
      title:'test',
      path:'/second-page',
    }
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
