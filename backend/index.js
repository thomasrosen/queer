require('dotenv').config()

const isDevEnvironment = process.env.environment === 'dev' || false

const express = require('express')

const {
  loadData,
  checkOrigin,
  translateObject,
  bboxDistance,
} = require('./functions.js')

const app = express()
app.use(function (req, res, next) {

  // const origin = req.get('origin')
  const origin = req.header('Origin')
  if (checkOrigin(origin)) {
    req.is_subdomain = true
    req.origin = origin
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Credentials', true)
  } else {
    req.is_subdomain = false
  }

  next()
})

app.get('/api/', (req, res) => {
  res.json({ message: 'Hello from the backend!' })
})
app.get('/api/resources.json', (req, res) => {
  let data = loadData()
  if (!data) {
    res.status(500).json({ error: 'Could not load data.' })
    return
  }

  let resources = data.resources

  let lat = null
  if (req.query.hasOwnProperty('lat')) {
    lat = parseFloat(req.query.lat || '')
    if (isNaN(lat)) {
      lat = null
    }
  }

  let lon = null
  if (req.query.hasOwnProperty('lon')) {
    lon = parseFloat(req.query.lon || '')
    if (isNaN(lon)) {
      lon = null
    }
  }

  let tags = null
  if (req.query.hasOwnProperty('tags')) {
    tags = req.query.tags.split(',')
      .map((tag) => tag.trim().toLowerCase())
  }

  let search_text = null
  if (req.query.hasOwnProperty('q')) {
    search_text = req.query.q
    if (typeof search_text !== 'string' || search_text === '') {
      search_text = null
    }
  }


  
  if (tags) {
    resources = resources
    .filter((resource) => {
      let hasAllTags = false
      if (resource.tags) {
        // check if resource.tags includes all tags
        hasAllTags = tags.every(tag => resource.tags.includes(tag))
      }
      return hasAllTags
    })
  }

  if (lat && lon) {
    resources = resources
    .filter((resource) => {
      // check if lat/lon is in resource.bbox
      // plus add an also accepted margin of the size of the bbox

      const margin = 0.5

      if (resource.bbox) {
        if (
          lat <= resource.bbox.north + ((resource.bbox.north - resource.bbox.south) * margin) &&
          lat >= resource.bbox.south - ((resource.bbox.north + resource.bbox.south) * margin) &&
          lon <= resource.bbox.east + ((resource.bbox.east - resource.bbox.west) * margin) &&
          lon >= resource.bbox.west - ((resource.bbox.east + resource.bbox.west) * margin)
        ) {
          return true
        }
      }

      return false
    })
    .map((resource) => {
      const {
        lat: center_lat = 0,
        lon: center_lon = 0,
      } = resource.bbox_center || {}

      let distance = bboxDistance(center_lat, center_lon, lat, lon)
      distance += resource.bbox_distance * 0.5

      return {
        ...resource,
        sort_distance: distance,
      }
    })
    // .sort((a, b) => {
    //   return a.distance - b.distance
    // })
  }

  if (search_text) {
    search_text = search_text.toLowerCase()

    resources = resources
    .filter((resource) => {
      const texts = [
        ...Object.values(resource.title || {}),
        ...Object.values(resource.description || {}),
      ]
        .map((text) => text.toLowerCase())

      let found = false

      for (let text of texts) {
        if (text.includes(search_text)) {
          found = true
          break
        }
      }

      return found
    })
  }

  // sort resources by sort_distance (if available)
  // smaller distance => closer to user => higher in list
  resources = resources
    .sort((a, b) => {
      if (a.sort_distance && b.sort_distance) {
        return a.sort_distance - b.sort_distance
      } else if (a.sort_distance) {
        return -1
      } else if (b.sort_distance) {
        return 1
      } else {
        return 0
      }
    })

  const accept_language = req.headers["accept-language"]

  resources = resources
    .map((resource) => {
      return {
        ...resource,
        title: translateObject(resource.title, accept_language),
        description: translateObject(resource.description, accept_language),
      }
    })

  res.json({
    resources,
  })
})
app.get('/api/tags.json', (req, res) => {
  let data = loadData()
  if (!data) {
    res.status(500).json({ error: 'Could not load data.' })
    return
  }

  let resources = data.resources

  let lat = null
  if (req.query.hasOwnProperty('lat')) {
    lat = parseFloat(req.query.lat || '')
    if (isNaN(lat)) {
      lat = null
    }
  }

  let lon = null
  if (req.query.hasOwnProperty('lon')) {
    lon = parseFloat(req.query.lon || '')
    if (isNaN(lon)) {
      lon = null
    }
  }

  if (lat && lon) {
    resources = resources
    .filter((resource) => {
      // check if lat/lon is in resource.bbox
      if (resource.bbox) {
        if (
          lat <= resource.bbox.north &&
          lat >= resource.bbox.south &&
          lon <= resource.bbox.east &&
          lon >= resource.bbox.west
        ) {
          return true
        }
      }

      return false
    })
  }

  let tags = resources
    .flatMap((resource) => resource.original_tags)
    .filter((tag, index, self) => self.indexOf(tag) === index)
    .filter(Boolean)
    .filter(tag => tag !== 'queer') // this is obivous
    .sort()

  res.json({
    tags,
  })
})

// app.get('/', (req, res) => {
//   res.sendFile('index.html', { root: '../frontend/build/' })
// })

app.use('/', express.static('../frontend/build/'))

const port = 17215 // queer = 17 21 5 5 18
const host = '0.0.0.0' // Uberspace wants 0.0.0.0
app.listen(port, host, () => {
  console.info(`
    Server listening at http://${host}:${port}
    and at http://localhost:${port}
  `)
})
