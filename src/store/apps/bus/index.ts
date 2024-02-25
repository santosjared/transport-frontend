import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// ** Axios Imports
import axios from 'axios'
import axiosInstance from '../../instancesAxios'

interface Redux {
  dispatch: Dispatch<any>
}

// ** Fetch Users
export const fetchData = createAsyncThunk('appBus/fetchData', async () => {
    const response = await axiosInstance.get('/bus')
    return response.data
})

// ** Add User
export const addBus = createAsyncThunk(
  'appBus/addBus',
  async (data: { [key: string]: any }, {dispatch }: Redux) => {
    const response = await axiosInstance.post('/bus', data, {
      headers:{
        'Content-Type': 'multipart/form-data'
      }
    })
    dispatch(fetchData())
    return response.data
  }
)

// ** Delete User
export const deleteBus = createAsyncThunk(
  'appBus/deleteBus',
  async (id: number | string, {dispatch }: Redux) => {
    const response = await axiosInstance.delete(`/bus/${id}`, {
      data: id
    })
    dispatch(fetchData())

    return response.data
  }
)

export const appUsersSlice = createSlice({
  name: 'appBus',
  initialState: {
    data: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload
    })
  }
})

export default appUsersSlice.reducer
