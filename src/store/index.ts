// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import bus from 'src/store/apps/bus'


export const store = configureStore({
  reducer: {
    bus
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
