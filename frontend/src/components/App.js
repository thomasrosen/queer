import React from 'react'
import './App.css'

import '../fonts/ubuntu-v15-latin/index.css'
import '../fonts/ubuntu-mono-v10-latin/index.css'

import {
  // NavLink,
  Outlet,
} from 'react-router-dom'

import Tag from './Tag.js'

function pushReplaceSearchParams(new_searchParams) {
  let url = new URL(window.location)

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

  url = new URL(`${url.origin}${url.pathname}${new_search_params_string.length > 0 ? '?' + new_search_params_string : ''}`)
  window.history.pushState({}, '', url)
}

export default function App() {

  const [error, setError] = React.useState(null)

  const [resources, setResources] = React.useState([])
  const [tags, setTags] = React.useState(null)

  const [latitude, setLatitude] = React.useState(null)
  const [longitude, setLongitude] = React.useState(null)
  const [selectedTags, setSelectedTags] = React.useState(new Set())

  const loadResources = React.useCallback(() => {

    const current_url = new URL(window.location);
    const latitude = (current_url.searchParams.get('lat') || '')
    const longitude = (current_url.searchParams.get('lon') || '')
    const tags = (current_url.searchParams.get('tags') || '').split(',').filter(Boolean)

    const search_params_data = {}

    if (
      typeof latitude === 'string' && latitude.length > 0 &&
      typeof longitude === 'string' && longitude.length > 0
    ) {
      search_params_data.lat = latitude
      search_params_data.lon = longitude
    }

    if (Array.isArray(tags) && tags.length > 0) {
      search_params_data.tags = tags.join(',')
    }

    const search_params = new URLSearchParams(search_params_data).toString()

    const url = `${window.urls.api}resources.json${search_params.length > 0 ? '?' + search_params : ''}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setResources(data.resources)
      })
  }, [])

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
        setTags(data.tags)
      })

  }, [])

  const getLocation = React.useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setError('')

        const new_latitude = position.coords.latitude
        const new_longitude = position.coords.longitude
        setLatitude(new_latitude)
        setLongitude(new_longitude)

        pushReplaceSearchParams(new URLSearchParams([
          ['lat', new_latitude],
          ['lon', new_longitude],
        ]))

        loadTags()
        loadResources()
      }, (error) => {
        setError(error.message)
      })
    } else {
      setError('Geolocation is not supported by this browser.')
    }
  }, [loadTags, loadResources])

  const clearLocation = React.useCallback(() => {
    setLatitude(null)
    setLongitude(null)
    pushReplaceSearchParams(new URLSearchParams([
      ['lat', ''],
      ['lon', ''],
    ]))
    loadTags()
    loadResources()
  }, [loadTags, loadResources])

  const toggleTag = React.useCallback(tag => {

    if (selectedTags.has(tag)) {
      selectedTags.delete(tag)
    } else {
      selectedTags.add(tag)
    }
    setSelectedTags(new Set(selectedTags))

    pushReplaceSearchParams(new URLSearchParams([
      ['tags', [...selectedTags].filter(Boolean).join(',')],
    ]))


    loadResources()
  }, [loadResources, selectedTags])

  React.useEffect(() => {

    const current_url = new URL(window.location);
    const latitude = (current_url.searchParams.get('lat') || '')
    setLatitude(latitude)
    const longitude = (current_url.searchParams.get('lon') || '')
    setLongitude(longitude)
    const selected_tags = (current_url.searchParams.get('tags') || '').split(',')
    setSelectedTags(new Set(selected_tags))

    loadTags()
    loadResources()
  }, [loadTags, loadResources])

  return <div className="app_wrapper">
    <header>
      <h1>🏳️‍🌈 QR</h1>
      <a href="https://github.com/thomasrosen/queer" target="_blank" rel="noreferrer">Sourcecode</a>
    </header>
    
    <main>
      <h1>🏳️‍🌈 Queer Resources</h1>
      <br />

      <p>A collection of resources for queer people. You're of course also welcome to look through the information if you are an ally.</p>

      <p>You can filter the links via your location and some tags.</p>

      <br />

      {error && <p>Error: {error}</p>}

      <div className="tag_row">
        <button onClick={getLocation}>Filter for resources near you</button>
        {
          latitude && longitude
          ? <button onClick={clearLocation}>Clear Location</button>
          : null
        }
      </div>
      {
        latitude && longitude
          ? <p>Location: {latitude} / {longitude}</p>
          : null
      }

      <br />

      <div className="tag_row">
        { tags && tags.map(tag => {
          return <Tag
            key={tag}
            tag={tag}
            data-selected={selectedTags.has(tag) ? 'true' : 'false'}
            onClick={() => toggleTag(tag)}
          />
        }) }
      </div>

      <br />
      <br />

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
                    // data-selected={selectedTags.has(tag) ? 'true' : 'false'}
                    onClick={() => toggleTag(tag)}
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
