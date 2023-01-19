import React from 'react'
import './App.css'

import '../fonts/ubuntu-v15-latin/index.css'
import '../fonts/ubuntu-mono-v10-latin/index.css'

import {
  Outlet,
} from 'react-router-dom'

import Tag from './Tag.js'

import { useSelector, useDispatch } from 'react-redux'
import {
  toggleTag,
  
  selectSelectedTags,
} from '../redux/slices/filterSlice.js'
import {
  fetchResources,
  selectResources,
} from '../redux/slices/resourcesSlice.js'

import Filters from './Filters.js'

export default function App() {

  const dispatch = useDispatch()

  const resources = useSelector(selectResources)
  const selectedTags = useSelector(selectSelectedTags)

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
