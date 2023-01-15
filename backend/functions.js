
const yaml = require('js-yaml');
const fs = require('fs');
const { negotiateLanguages } = require('@fluent/langneg')

let cachedData = null;

function loadData () {
  if (cachedData) {
    return cachedData;
  }

  try {
    let data = yaml.load(fs.readFileSync('./data.yml', 'utf8'));
    
    if (Array.isArray(data.resources)) {
      data.resources = data.resources
        .filter(resource => resource.tags && resource.tags.includes('queer')) // must include queer-tag
        .map(resource => {
          resource.tags = (resource.tags || []).filter((tag) => tag !== 'queer') // remove queer-tag
          return resource
        })
    }
    cachedData = data;
    return data;
  } catch (error) {
    console.error(error);
  }

  return null;
}

function checkOrigin(origin) {
  let isAllowed = false

  if (typeof origin === 'string') {
    if (
      // allow from main domain
      origin === 'queer.thomasrosen.me'
      || origin.endsWith('://queer.thomasrosen.me')

      // allow from subdomains
      || origin.endsWith('.thomasrosen.me')

      // allow for localhost
      || origin.endsWith('localhost:3000')
      || origin.endsWith('localhost:1337')
      || origin.endsWith('0.0.0.0:3000')
      || origin.endsWith('0.0.0.0:1337')
    ) {
      isAllowed = true
    }
  }

  return isAllowed
}

function translateObject(obj, accept_language) {
  if (!obj || obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    return obj
  }

  const available_locales = Object.keys(obj)
  const default_locale = available_locales[0]
  let bestLocale = negotiateLanguages(
    accept_language, // requested locales
    available_locales, // available locales
    {
      defaultLocale: default_locale,
      strategy: 'lookup',
    }
  )
  bestLocale = bestLocale[0]
  return obj[bestLocale]
}

module.exports = {
  loadData,
  checkOrigin,
  translateObject,
};
