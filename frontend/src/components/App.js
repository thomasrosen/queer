import React from 'react'
import './App.css'

import '../fonts/ubuntu-v15-latin/index.css'
import '../fonts/ubuntu-mono-v10-latin/index.css'

import parsePhoneNumber from 'libphonenumber-js' // TODO move this to the backend to save bandwidth on the client

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

function get_smaller_url (url) {
  // check if url only contains exactly three slashes
  if (url.split('/').length <= 4) {
    // url is only a domain
    const regex = /.*:\/\/(?:www\.)?([^/]*).*/gm
    const smaller_url = url.replace(regex, `$1`)
    return smaller_url
  }

  // url has a path so return full url
  return url
}

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
        The website is maintained by <a href="https://thomasrosen.me/">Thomas Rosen</a>.<br />
        Send an email to <a href="mailto:queer@thomasrosen.me">queer@thomasrosen.me</a> if you want to add a resource.
      </p>

      <p>
        Your privacy is important to me. The website saves no data about you. I have analytics enabled, but these are fully annonymous. Look at the source code or ask me, if you need more information.<br />
        And fyi the website is hosted at <a href="https://uberspace.de/" target="_blank" rel="noreferrer">Uberspace</a> in the EU.
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
          const links = []

          let main_link = null
          if (resource.hasOwnProperty('link')) {
            if (Array.isArray(resource.link) && resource.link.length > 0) {
              main_link = resource.link[0]
              links.push(...resource.link.map(link => ({
                url: link,
                title: get_smaller_url(link),
              })))
            } else if (typeof resource.link === 'string') {
              main_link = resource.link
              links.push({
                url: resource.link,
                title: get_smaller_url(resource.link),
              })
            }
          }

          if (
            resource.hasOwnProperty('contact')
            && Array.isArray(resource.contact)
            && resource.contact.length > 0
          ) {
            for (const contact of resource.contact) {
              if (contact.hasOwnProperty('phone')) {
                const phoneNumber = parsePhoneNumber(contact.phone)
                links.push({
                  url: phoneNumber.getURI(),
                  title: phoneNumber.formatInternational(), // phoneNumber.formatNational() 
                })
              }
              if (contact.hasOwnProperty('email')) {
                links.push({
                  url: `mailto:${contact.email}`,
                  title: contact.email,
                })
              }
            }
          }

          return <div key={JSON.stringify(resource)}>
            <h3>
              {
                main_link !== null
                  ? <a href={main_link} target="_blank" rel="noreferrer">
                    {resource.title}
                  </a>
                  : resource.title
              }
            </h3>
            {
              !!resource.description && resource.description.length > 0
                ? <p>{resource.description}</p>
                : null
            }

            <div className="tag_row small">
              {
                links.map(({title, url}) => {
                  return <a key={url} href={url}>
                    <Tag
                      className="small"
                      tag={title}
                      style={{
                        cursor: 'pointer'
                      }}
                      data-selected="false"
                    />
                  </a>
                })
              }
            </div>

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
