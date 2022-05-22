import {createSlice} from '@reduxjs/toolkit'
import {PURGE} from 'redux-persist'

const initialState = {}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserWalletAddress: (state, action) => {
            state.userWalletAddress = action.payload
        },
        setUserToken: (state, action) => {
            state.userToken = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(PURGE, () => initialState)
    },
})

// Action creators are generated for each case reducer function
export const {setUserWalletAddress, setUserToken} = userSlice.actions

export default userSlice.reducer
