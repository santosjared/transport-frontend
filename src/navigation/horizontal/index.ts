// ** Type import
import axios from 'axios'
import { useState } from 'react'
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navegatePaths = async ()=>{
  try{
    const paths:any[] = []
      const response = await axios.get('/auth')
      if (response.data && response.data.access) {
        response.data.access.map((rule:any)=>{
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
      }
      return paths
  }catch(err){
    console.log(err)
    return[]
  }
}
const navigation = (): HorizontalNavItemsType =>[]
export default navigation
