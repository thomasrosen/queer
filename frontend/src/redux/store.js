import { configureStore } from '@reduxjs/toolkit'
import filterReducer from './slices/filterSlice.js'
import resourcesReducer from './slices/resourcesSlice.js'

export default configureStore({
  reducer: {
    filter: filterReducer,
    resources: resourcesReducer,
  }
})
