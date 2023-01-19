import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const resourcesSlice = createSlice({
  name: 'resources',
  initialState: {
    resources: [],
  },
  reducers: {
    setResources: (state, action) => {
      state.resources = action.payload
    },
  }
})

export const {
  setResources,
} = resourcesSlice.actions

export const fetchResources = createAsyncThunk('resources/fetchResources', async (value, thunkApi) => {
  console.log('fetchResources')
  const {
    dispatch,
    getState,
  } = thunkApi || {}

  const { filter } = getState()

  const {
    latitude,
    longitude,
    selectedTags,
    queryText,
  } = filter || {}

  const search_params_data = {}

  if (
    latitude !== null && String(latitude).length > 0
    && longitude !== null && String(longitude).length > 0
  ) {
    search_params_data.lat = latitude
    search_params_data.lon = longitude
  }

  const filtered_selectedTags = selectedTags.filter(Boolean)
  if (Array.isArray(filtered_selectedTags) && filtered_selectedTags.length > 0) {
    search_params_data.tags = filtered_selectedTags.join(',')
  }

  if (typeof queryText === 'string' && queryText.length > 0) {
    search_params_data.q = queryText
  }

  const search_params = new URLSearchParams(search_params_data).toString()

  const url = `${window.urls.api}resources.json${search_params.length > 0 ? '?' + search_params : ''}`;

  console.log('url', url)

  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log('data', data)
      dispatch(setResources(data.resources))
    })
})

export const selectResources = state => state.resources.resources

export default resourcesSlice.reducer
