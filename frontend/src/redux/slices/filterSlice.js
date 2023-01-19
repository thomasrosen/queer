import { createSlice } from '@reduxjs/toolkit'

function pushReplaceSearchParams(new_searchParams) {
  let url = new URL(window.location)

  const old_search_params_string = url.searchParams.toString()

  const new_search_params_string = new URLSearchParams(
    [
      ...(
        Array.from(url.searchParams.entries())
          .filter(([key]) => !new_searchParams.has(key))
      ),
      ...(
        [...new_searchParams.entries()]
          .filter(([, value]) => String(value).length > 0)
      ),
    ]
      .sort(([key_a], [key_b]) => key_a.localeCompare(key_b)) // sort alphabetically
  ).toString()

  if (old_search_params_string !== new_search_params_string) {
    url = new URL(`${url.origin}${url.pathname}${new_search_params_string.length > 0 ? '?' + new_search_params_string : ''}`)
    window.history.pushState({}, '', url)
  }
}

export const filterSlice = createSlice({
  name: 'filter',
  initialState: {
    tags: [],
    selectedTags: [],
    queryText: '',
    latitude: 0,
    longitude: 0,
  },
  reducers: {
    setTags: (state, action) => {
      state.tags = action.payload
    },
    setSelectedTags: (state, action) => {
      state.selectedTags = action.payload
    },
    toggleTag: (state, action) => {
      if (state.selectedTags.includes(action.payload)) {
        state.selectedTags = state.selectedTags.filter(tag => tag !== action.payload)
      } else {
        state.selectedTags.push(action.payload)
      }

      state.selectedTags = state.selectedTags.filter(Boolean)

      if (state.selectedTags.length === 0) {
        pushReplaceSearchParams(new URLSearchParams([
          ['tags', ''],
        ]))
      } else {
        pushReplaceSearchParams(new URLSearchParams([
          ['tags', state.selectedTags.join(',')],
        ]))
      }
    },
    setQueryText: (state, action) => {
      state.queryText = action.payload

      if (state.queryText.length === 0) {
        pushReplaceSearchParams(new URLSearchParams([
          ['q', ''],
        ]))
      } else {
        pushReplaceSearchParams(new URLSearchParams([
          ['q', state.queryText],
        ]))
      }
    },
    setGeoLocation: (state, action) => {
      state.latitude = action.payload.latitude
      state.longitude = action.payload.longitude

      pushReplaceSearchParams(new URLSearchParams([
        ['lat', state.latitude],
        ['lon', state.longitude],
      ]))
    },
    clearGeoLocation: (state) => {
      state.latitude = null
      state.longitude = null

      pushReplaceSearchParams(new URLSearchParams([
        ['lat', ''],
        ['lon', ''],
      ]))
    }
  }
})

export const {
  setTags,
  setSelectedTags,
  toggleTag,
  setQueryText,
  setGeoLocation,
  clearGeoLocation,
} = filterSlice.actions

export const selectTags = state => state.filter.tags
export const selectSelectedTags = state => state.filter.selectedTags.filter(Boolean)
export const selectQueryText = state => state.filter.queryText
export const selectGeoLocation = state => ({
  latitude: state.filter.latitude,
  longitude: state.filter.longitude,
})

export default filterSlice.reducer
