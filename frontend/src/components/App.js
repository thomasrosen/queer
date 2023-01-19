import React from 'react'
import './App.css'

import '../fonts/ubuntu-v15-latin/index.css'
import '../fonts/ubuntu-mono-v10-latin/index.css'

import {
  // NavLink,
  Outlet,
} from 'react-router-dom'

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
  // setResources,
  fetchResources,
  selectResources,
} from '../redux/slices/resourcesSlice.js'

function Filters({
  onError = () => { },
  resources = [],
}) {
  const dispatch = useDispatch()

  const tags = useSelector(selectTags)
  const selectedTags = useSelector(selectSelectedTags)
  const queryText = useSelector(selectQueryText)
  const { latitude, longitude } = useSelector(selectGeoLocation)

  // const resources = useSelector(selectResources)

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
    
    dispatch(setGeoLocation({
      latitude: 48.1351253,
      longitude: 11.5819806,
    }))

    loadTags()
    loadResources()

    onError('')

    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition((position) => {
    //     onError('')

    //     dispatch(setGeoLocation({
    //       latitude: position.coords.latitude,
    //       longitude: position.coords.longitude,
    //     }))

    //     loadTags()
    //   }, (error) => {
    //     onError(error.message)
    //   })
    // } else {
    //   onError('Geolocation is not supported by this browser.')
    // }
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
    <h2>Filter for resources in your area:</h2>
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

export default function App() {

  const dispatch = useDispatch()

  const resources = useSelector(selectResources)
  const selectedTags = useSelector(selectSelectedTags)

  // React.useEffect(() => {
  //   function loadResources() {
  //     dispatch(fetchResources())
  //   }
  //   loadResources()
  //   window.addEventListener('popstate', loadResources)
  //
  //   return () => {
  //     window.removeEventListener('popstate', loadResources)
  //   }
  // }, [dispatch])

  const thisToggleTag = React.useCallback(tag => {
    dispatch(toggleTag(tag))
    dispatch(fetchResources())
  }, [dispatch])

  const [showFilters, setShowFilters] = React.useState(false)

  const [error, setError] = React.useState(null)
  
  const toggleFilters = () => {
    setShowFilters(showFilters => !showFilters)
  }

  return <div className={`app_wrapper ${showFilters === true ? 'show_filters' : 'hide_filters'}`}>
    <header>

      {
        showFilters === true
          ? <button
            className="hide_on_large_screens"
            onClick={toggleFilters}
          >
            Close Filters
          </button>
          : null
      }

      <h1>🏳️‍🌈 QR</h1>
      
      <a href="https://github.com/thomasrosen/queer" target="_blank" rel="noreferrer">Sourcecode</a>
    </header>

    <nav>
      <Filters
        onError={setError}
        resources={resources}
        />
    </nav>
    
    <main>
      <h1>🏳️‍🌈 Queer Resources</h1>

      <br />

      <p>A collection of resources for queer people. You're of course also welcome to look through the information if you are an ally.</p>

      <p>You can filter the links via your location and some tags.</p>

      <p>
        The website is maintained by <a href="https://thomasrosen.me/" target="_blank" rel="noreferrer">Thomas Rosen</a>.<br />
        Send an email to <a href="mailto:queer@thomasrosen.me">queer@thomasrosen.me</a> if you want to add a resource.
      </p>

      <div className="hide_on_large_screens">
        <br />
        <button
          onClick={toggleFilters}
        >
          {showFilters === true ? 'Close Filters' : 'Open Filters'}
        </button>
        <br />
      </div>

      <br />
      <br />

      {error && <p>Error: {error}</p>}

      {
        resources &&
        resources.map(resource => {
          return <div key={JSON.stringify(resource)}>
            <h3>
              <a href={resource.link} target="_blank" rel="noreferrer">
                {resource.title}
              </a>
            </h3>
            {
              !!resource.description && resource.description.length > 0
                ? <p>{resource.description}</p>
                : null
            }
            <div className="tag_row small">
              {
                resource.tags.map(tag => {
                  return <Tag
                    className="small"
                    key={tag}
                    tag={tag}
                    data-selected={selectedTags.includes(tag) ? 'true' : 'false'}
                    onClick={() => thisToggleTag(tag)}
                  />
                })
              }
            </div>
            <br />
          </div>
        })
      }
      {
        resources && resources.length === 0
          ? <p>No resources found.</p>
          : null
      }
      {
        !resources
          ? <p>Loading...</p>
          : null
      }

      <Outlet />
    </main>

  </div>
}
