// ** Type import
import { useEffect, useState } from 'react'
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { useService } from 'src/hooks/useService'

const navigation = (): VerticalNavItemsType => {
  const [rules,setRules] = useState<string[]>([])

  const {Get} = useService()
  useEffect(() => {
    const fetch = async () => {
      const response = await Get('/auth')
      if (response.data && response.data.access) {
        setRules(response.data.access)
      }
    }
    fetch()
  }, [])
  const paths:any[] = []
  rules.map((rule:any)=>{
    if(rule.name === 'Listar-monitoreo'){
      paths.push(  {
        title:'Monitoreo',
        path:'/minibus/monitoreo',
        icon:'eos-icons:monitoring',
      })
    }
    if(rule.name === 'Listar-usuarios'){
      paths.push( {
        title:'Registro de usuarios',
        path:'/minibus/users',
        icon:'mdi:users'
      })
    }
    if(rule.name === 'Listar-rol'){
      paths.push(  {
        title:'Roles y Permiso',
        path:'/minibus/rol',
        icon:'carbon:user-role'
      })
    }
    if(rule.name === 'Listar-microbus'){
      paths.push( {
        title: 'Registro de microbuses',
        path: '/minibus/bus',
        icon: 'mdi:bus'
      })
    }
    if(rule.name === 'Listar-tarifa'){
      paths.push({
        title:'Registro de tarifas',
        path:'/minibus/tarifas',
        icon:'fluent:money-hand-20-regular'
      })
    }
    if(rule.name === 'Listar-horario'){
      paths.push( {
        title:'Registro de horarios',
        path:'/minibus/horario',
        icon:'game-icons:notebook'
      })
    }
    if(rule.name === 'Listar-ruta'){
      paths.push(
        {
          title:'Registro de rutas',
          path:'/minibus/road',
          icon:'material-symbols:fork-right'
        }
      )
    }
    if(rule.name === 'Listar-linea'){
      paths.push(
        {
          title: 'Registro de lineas',
          path: '/minibus/lineas',
          icon: 'tabler:list-letters'
        }
      )
    }
  })
  return paths
}

export default navigation
