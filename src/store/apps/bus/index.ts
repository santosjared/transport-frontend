import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {apiService} from 'src/store/services/apiService'
import { HttpStatus } from 'src/utils/HttpStatus'

interface Redux {
  dispatch: Dispatch<any>
}
interface Props {
  data: { [key: string]: any };
  id: string,
  filters: any
}

export const fetchData = createAsyncThunk('appBus/fetchBus',
  async (filters?: { [key: string]: any }) => {
    if (filters) {
      const response = await apiService.Get('/bus', filters)
      return response.data
    }
    const response = await apiService.Get('/bus')
    return response.data
  }
)

export const addBus = createAsyncThunk('appBus/addBus',
  async (data: { [key: string]: any }, { dispatch }: Redux) => {
    const response = await apiService.Post('/bus', data.data)
    if (response.status === HttpStatus.BAD_REQUEST) {
      const res = {
        success: false,
        data: response.data
      }
      return res
    }
    if (response.status === HttpStatus.CREATED) {
      const res = {
        success: true,
        data: response.data
      }
      dispatch(fetchData(data.filters))
      return res
    }
    if (response.status === HttpStatus.INTERNAL_SERVER_ERROR) {
      // Manejar el error del servidor aquí
    }
    return response
  }
)

export const deleteBus = createAsyncThunk('appBus/deleteBus',
  async (id: number | string, { dispatch }: Redux) => {
    const response = await apiService.Delete('/bus', id)
    dispatch(fetchData())
    return response.data
  }
)

export const updateBus = createAsyncThunk('appBus/updateBus',
  async ({ data, id, filters }: Props, { dispatch }: Redux) => {
    const response = await apiService.Update('/bus', data, id)
    if (response.status === HttpStatus.BAD_REQUEST) {
      const res = {
        success: false,
        data: response.data
      }
      return res
    }
    if (response.status === HttpStatus.OK) {
      const res = {
        success: true,
        data: response.data
      }
      dispatch(fetchData(filters))
      return res
    }
    if (response.status === HttpStatus.INTERNAL_SERVER_ERROR) {
      // Manejar el error del servidor aquí
    }
    return response
  }
)

export const appUsersSlice = createSlice({
  name: 'appBus',
  initialState: {
    data: [],
    total: 0,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchData.fulfilled, (state, action) => {
        state.data = action.payload.result;
        state.total = action.payload.total
      })
  }
})

export default appUsersSlice.reducer
