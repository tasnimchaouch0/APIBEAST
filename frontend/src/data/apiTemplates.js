export const API_TEMPLATES = [
  {
    id: 'jsonplaceholder-posts',
    name: 'JSONPlaceholder - Posts',
    description: 'Free fake REST API for testing',
    endpoint: 'https://jsonplaceholder.typicode.com/posts',
    method: 'GET',
    headers: {},
    body: '',
    category: 'Demo'
  },
  {
    id: 'jsonplaceholder-create',
    name: 'JSONPlaceholder - Create Post',
    description: 'Test POST request with JSON body',
    endpoint: 'https://jsonplaceholder.typicode.com/posts',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'foo', body: 'bar', userId: 1 }, null, 2),
    category: 'Demo'
  },
  {
    id: 'github-user',
    name: 'GitHub - User Profile',
    description: 'Get GitHub user information',
    endpoint: 'https://api.github.com/users/github',
    method: 'GET',
    headers: { 'Accept': 'application/vnd.github.v3+json' },
    body: '',
    category: 'Real APIs'
  },
  {
    id: 'github-repos',
    name: 'GitHub - User Repositories',
    description: 'List user repositories',
    endpoint: 'https://api.github.com/users/github/repos',
    method: 'GET',
    headers: { 'Accept': 'application/vnd.github.v3+json' },
    body: '',
    category: 'Real APIs'
  },
  {
    id: 'httpbin-get',
    name: 'HTTPBin - Test GET',
    description: 'Simple HTTP request & response service',
    endpoint: 'https://httpbin.org/get',
    method: 'GET',
    headers: {},
    body: '',
    category: 'Demo'
  },
  {
    id: 'httpbin-post',
    name: 'HTTPBin - Test POST',
    description: 'Test POST with JSON data',
    endpoint: 'https://httpbin.org/post',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ test: 'data', timestamp: Date.now() }, null, 2),
    category: 'Demo'
  },
  {
    id: 'weather-api',
    name: 'Open-Meteo - Weather',
    description: 'Free weather forecast API',
    endpoint: 'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true',
    method: 'GET',
    headers: {},
    body: '',
    category: 'Real APIs'
  },
  {
    id: 'rest-countries',
    name: 'REST Countries - All',
    description: 'Get information about countries',
    endpoint: 'https://restcountries.com/v3.1/all',
    method: 'GET',
    headers: {},
    body: '',
    category: 'Real APIs'
  }
]
