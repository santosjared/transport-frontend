import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useService } from 'src/hooks/useService'

interface Redux {
  dispatch: Dispatch<any>
}
export const fetchData = createAsyncThunk('appHorario/fetchHorario', async () => {
    const {Get} = useService()
    const response = await Get('/horario')
    return response.data
})

export const addHorario = createAsyncThunk('appHorario/addHorario',
  async (data: { [key: string]: any }, {dispatch }: Redux) => {
    const {Post}= useService()
    const response = await Post('/horario', data) 
    dispatch(fetchData())
    return response.data
  }
)

export const deleteHorario = createAsyncThunk('appHorario/deleteHorario',
  async (id: number | string, {dispatch }: Redux) => {
    const {Delete} = useService()
    const response = await Delete('/horario', id)
    dispatch(fetchData())
    return response.data
  }
)
export const findOneHorario = createAsyncThunk('appHorario/deleteHorario',
  async (id: number | string, {dispatch }: Redux) => {
    const {Delete} = useService()
    const response = await Delete('/horario', id)
    dispatch(fetchData())
    return response.data
  }
)
export const appUsersSlice = createSlice({
  name: 'appHorario',
  initialState: {
    data: [],
    isLoading:false,
    isSuccess:false,
    isError:false
  },
  reducers: {},
  extraReducers: builder => {
    builder
    .addCase(fetchData.pending,(state)=>{
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
    })
    .addCase(fetchData.fulfilled, (state, action) => {
        state.isLoading = false; 
        state.isSuccess = true;  
        state.isError = false;   
        state.data = action.payload; 
    })
    .addCase(fetchData.rejected, (state) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
      })
  }
})

export default appUsersSlice.reducer
