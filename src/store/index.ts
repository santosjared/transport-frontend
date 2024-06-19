// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import bus from 'src/store/apps/bus'
import device from 'src/store/apps/device'
import users from 'src/store/apps/users'
import licence from 'src/store/apps/licence-driver'
import linea from 'src/store/apps/linea'
import road from 'src/store/apps/road'
import tarifa from 'src/store/apps/tarifa'
import horario from './apps/horario'
import rol from './apps/rol'
import userAndBus from 'src/store/apps/bus/fectchUsers'
import monitoreo from './apps/monitoreo'

export const store = configureStore({
  reducer: {
    device,
    bus,
    users,
    licence,
    linea,
    road,
    tarifa, 
    horario,
    rol,
    userAndBus,
    monitoreo
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
