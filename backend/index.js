require('dotenv').config()

const isDevEnvironment = process.env.environment === 'dev' || false

const express = require('express')

const {
  loadData,
  checkOrigin,
  translateObject,
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

  if (tags) {
    resources = resources
    .filter((resource) => {
      if (resource.tags) {
        for (let tag of tags) {
          if (resource.tags.includes(tag)) { // include resource if any tag matches
            return true
          }
        }
      }
      return false
    })
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
    // .map((resource) => {


    //   // const distance = Math.sqrt(
    //   //   Math.pow(resource.lat - lat, 2) +
    //   //   Math.pow(resource.lon - lon, 2)
    //   // )
    //   // return {
    //   //   ...resource,
    //   //   distance,
    //   // }
    // })
    // data.resources.sort((a, b) => {
    //   return a.distance - b.distance
    // })
  }

  // sort resources by bbox_distance (if available)
  // smaller distance = closer to user
  // smaller distance = higher in list
  resources = resources
    .sort((a, b) => {
      if (a.bbox_distance && b.bbox_distance) {
        return a.bbox_distance - b.bbox_distance
      } else if (a.bbox_distance) {
        return -1
      } else if (b.bbox_distance) {
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
    .flatMap((resource) => resource.tags)
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
  const url = `http://${host}:${port}`
  console.log(`Server listening at ${url}`)
})

