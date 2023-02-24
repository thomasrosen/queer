import React from 'react'
import './App.css'

import '../fonts/ubuntu-v15-latin/index.css'
import '../fonts/ubuntu-mono-v10-latin/index.css'

import Tag from './Tag.js'

import { useSelector, useDispatch } from 'react-redux'
import {
  setTags,
  setSelectedTags,
  toggleTag,
  setQueryText,
  setGeoLocation,
  clearGeoLocation,

  selectTags,
  selectSelectedTags,
  selectQueryText,
  selectGeoLocation,
} from '../redux/slices/filterSlice.js'
import {
  fetchResources,
  selectResources,
} from '../redux/slices/resourcesSlice.js'

export default function Filters({
  onError = () => { },
}) {
  const dispatch = useDispatch()

  const tags = useSelector(selectTags)
  const selectedTags = useSelector(selectSelectedTags)
  const queryText = useSelector(selectQueryText)
  const { latitude, longitude } = useSelector(selectGeoLocation)

  const resources = useSelector(selectResources)

  const loadResources = React.useCallback(() => {
    dispatch(fetchResources())
  }, [dispatch])

  const loadTags = React.useCallback(() => {

    const current_url = new URL(window.location);
    const latitude = (current_url.searchParams.get('lat') || '')
    const longitude = (current_url.searchParams.get('lon') || '')

    const search_params_data = {}

    if (
      typeof latitude === 'string' && latitude.length > 0 &&
      typeof longitude === 'string' && longitude.length > 0
    ) {
      search_params_data.lat = latitude
      search_params_data.lon = longitude
    }

    const search_params = new URLSearchParams(search_params_data).toString()

    const url = `${window.urls.api}tags.json${search_params.length > 0 ? '?' + search_params : ''}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        dispatch(setTags(data.tags))
        loadResources()
      })

  }, [dispatch, loadResources])

  const getLocation = React.useCallback(() => {

    // dispatch(setGeoLocation({
    //   latitude: 48.1351253,
    //   longitude: 11.5819806,
    // }))

    // loadTags()
    // loadResources()

    // onError('')

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        onError('')

        dispatch(setGeoLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }))

        loadTags()
        loadResources()
      }, (error) => {
        onError(error.message)
      })
    } else {
      onError('Geolocation is not supported by this browser.')
    }
  }, [dispatch, onError, loadTags, loadResources])

  const clearLocation = React.useCallback(() => {
    dispatch(clearGeoLocation())
    loadTags()
    loadResources()
  }, [dispatch, loadTags, loadResources])

  const thisToggleTag = React.useCallback(tag => {
    dispatch(toggleTag(tag))
    loadResources()
  }, [dispatch, loadResources])

  const queryTextChanged = React.useCallback(event => {
    if (event) {
      dispatch(setQueryText(event.target.value))
      loadResources()
    }
  }, [dispatch, loadResources])

  React.useEffect(() => {

    function reload() {
      const current_url = new URL(window.location);

      const latitude = (current_url.searchParams.get('lat') || '')
      const longitude = (current_url.searchParams.get('lon') || '')
      dispatch(setGeoLocation({ latitude, longitude }))

      const selected_tags = (current_url.searchParams.get('tags') || '').split(',')
      dispatch(setSelectedTags(selected_tags))

      const new_query_text = current_url.searchParams.get('q') || ''
      dispatch(setQueryText(new_query_text))

      loadResources()
    }
    reload()
    window.addEventListener('popstate', reload)

    return () => {
      window.removeEventListener('popstate', reload)
    }
  }, [dispatch, loadResources])

  React.useEffect(() => {
    loadTags()
  }, [loadTags, latitude, longitude])

  return <div>
    <h2>Filter for resources in near you:</h2>
    <div className="tag_row">
      <button onClick={getLocation}>Get my Location</button>
      {
        latitude && longitude
          ? <button onClick={clearLocation}>Clear Location</button>
          : null
      }
    </div>
    {
      latitude && longitude
        ? <p>Your Location: {latitude} / {longitude}</p>
        : null
    }

    <br />
    <h2>Filter by tag:</h2>
    <div className="tag_row">
      {tags && tags.map(tag => {
        return <Tag
          key={tag}
          tag={tag}
          data-selected={selectedTags.includes(tag) ? 'true' : 'false'}
          onClick={() => thisToggleTag(tag)}
        />
      })}
    </div>

    <br />
    <h2>Search:</h2>
    <input
      style={{ margin: '20px 0' }}
      type="search"
      placeholder="Search…"
      defaultValue={queryText}
      onChange={queryTextChanged}
    />

    <br />
    <br />
    <h2>Result Summary:</h2>
    <br />
    {
      resources.length === 0
        ? <p>No resources found.</p>
        : null
    }
    {
      resources.length === 1
        ? <p>One resources found.</p>
        : null
    }
    {
      resources.length > 1
        ? <p>{resources.length} resources found.</p>
        : null
    }

  </div>
}
