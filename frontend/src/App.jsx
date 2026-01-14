import { useState } from 'react'
import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8080/api'

const API_TEMPLATES = [
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
    category: 'Testing Tools'
  },
  {
    id: 'httpbin-post',
    name: 'HTTPBin - Test POST',
    description: 'Test POST with JSON data',
    endpoint: 'https://httpbin.org/post',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'APIBeast', type: 'testing' }, null, 2),
    category: 'Testing Tools'
  },
  {
    id: 'dummyjson-products',
    name: 'DummyJSON - Products',
    description: 'Fake e-commerce product data',
    endpoint: 'https://dummyjson.com/products',
    method: 'GET',
    headers: {},
    body: '',
    category: 'Demo'
  },
  {
    id: 'dummyjson-users',
    name: 'DummyJSON - Users',
    description: 'Fake user data for testing',
    endpoint: 'https://dummyjson.com/users',
    method: 'GET',
    headers: {},
    body: '',
    category: 'Demo'
  },
  {
    id: 'reqres-users',
    name: 'ReqRes - Users List',
    description: 'RESTful API for testing',
    endpoint: 'https://reqres.in/api/users?page=1',
    method: 'GET',
    headers: {},
    body: '',
    category: 'Demo'
  },
  {
    id: 'reqres-create',
    name: 'ReqRes - Create User',
    description: 'Test user creation endpoint',
    endpoint: 'https://reqres.in/api/users',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'John Doe', job: 'Developer' }, null, 2),
    category: 'Demo'
  }
]

function App() {
  const [endpoint, setEndpoint] = useState('')
  const [method, setMethod] = useState('GET')
  const [headers, setHeaders] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [tests, setTests] = useState([])
  const [error, setError] = useState(null)
  const [executing, setExecuting] = useState(false)
  const [results, setResults] = useState([])
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)

  const loadTemplate = (template) => {
    setEndpoint(template.endpoint)
    setMethod(template.method)
    setHeaders(Object.keys(template.headers).length > 0 ? JSON.stringify(template.headers, null, 2) : '')
    setBody(template.body)
    if (Object.keys(template.headers).length > 0 || template.body) {
      setShowAdvanced(true)
    }
    setShowTemplates(false)
    setError(null)
  }

  const exportAsJSON = () => {
    const exportData = {
      endpoint,
      method,
      timestamp: new Date().toISOString(),
      totalTests: results.length,
      passed: results.filter(r => r.status === 'passed').length,
      failed: results.filter(r => r.status === 'failed').length,
      results: results
    }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `apibeast-results-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportAsCSV = () => {
    const headers = ['Test Name', 'Status', 'Duration (ms)', 'Status Code', 'Errors']
    const rows = results.map(r => [
      r.test_name,
      r.status,
      r.duration_ms,
      r.response_status || 'N/A',
      r.errors.join('; ')
    ])
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `apibeast-results-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = async () => {
    const text = results.map(r => 
      `${r.test_name}: ${r.status.toUpperCase()} (${r.duration_ms}ms)${r.errors.length > 0 ? '\n  Errors: ' + r.errors.join(', ') : ''}`
    ).join('\n\n')
    try {
      await navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    } catch (err) {
      alert('Failed to copy to clipboard')
    }
  }

  const handleGenerateTests = async () => {
    if (!endpoint) {
      setError('Please enter an API endpoint')
      return
    }

    setLoading(true)
    setError(null)
    setTests([])

    try {
      const requestData = {
        endpoint,
        method
      }
      
      if (headers.trim()) {
        try {
          requestData.headers = JSON.parse(headers)
        } catch (e) {
          setError('Invalid JSON in headers')
          setLoading(false)
          return
        }
      }
      
      if (body.trim() && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        requestData.body = body
      }
      
      const response = await axios.post(`${API_BASE_URL}/generate-tests`, requestData)

      if (response.data.success) {
        setTests(response.data.tests)
      } else {
        setError(response.data.error || 'Failed to generate tests')
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  const handleExecuteTests = async () => {
    if (tests.length === 0) return

    setExecuting(true)
    setResults([])

    try {
      const response = await axios.post(`${API_BASE_URL}/execute-tests`, {
        tests
      })

      if (response.data.success) {
        setResults(response.data.results)
      } else {
        setError(response.data.error || 'Failed to execute tests')
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to execute tests')
    } finally {
      setExecuting(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'passed': return 'bg-emerald-500'
      case 'failed': return 'bg-red-500'
      case 'error': return 'bg-amber-500'
      default: return 'bg-slate-500'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-20 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block">
            <h1 className="text-7xl font-black mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent tracking-tight">
              APIBeast
            </h1>
            <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full"></div>
          </div>
          <p className="text-slate-400 text-xl mt-6 font-light">
            Unleash AI-powered testing on your APIs
          </p>
        </div>

        {/* API Templates Section */}
        <div className="mb-8">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="group relative overflow-hidden w-full"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
            <div className="relative px-6 py-4 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 hover:from-cyan-600/20 hover:to-blue-600/20 border border-cyan-500/30 rounded-2xl transition-all flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold">Try Example APIs</h3>
                  <p className="text-sm text-slate-400">Popular API templates to get started instantly</p>
                </div>
              </div>
              <svg className={`w-6 h-6 transition-transform ${showTemplates ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {showTemplates && (
            <div className="mt-4 backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl p-6 animate-in fade-in slide-in-from-top-2 duration-300">
              {['Demo', 'Real APIs', 'Testing Tools'].map(category => {
                const categoryTemplates = API_TEMPLATES.filter(t => t.category === category)
                return (
                  <div key={category} className="mb-6 last:mb-0">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">{category}</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {categoryTemplates.map(template => (
                        <button
                          key={template.id}
                          onClick={() => loadTemplate(template)}
                          className="group relative overflow-hidden text-left"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all"></div>
                          <div className="relative p-4 bg-slate-900/30 hover:bg-slate-900/50 border border-white/5 hover:border-purple-500/30 rounded-xl transition-all">
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-semibold text-white group-hover:text-purple-300 transition-colors">{template.name}</h5>
                              <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                                template.method === 'GET' ? 'bg-emerald-500/20 text-emerald-300' :
                                template.method === 'POST' ? 'bg-blue-500/20 text-blue-300' :
                                'bg-orange-500/20 text-orange-300'
                              }`}>
                                {template.method}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mb-2">{template.description}</p>
                            <p className="text-xs text-slate-500 font-mono truncate">{template.endpoint}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Main Input Card */}
        <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl p-8 mb-8 hover:border-white/20 transition-all">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold">Generate Tests</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="group">
              <label className="block text-sm font-semibold mb-3 text-slate-300 group-hover:text-purple-400 transition-colors">
                API Endpoint
              </label>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all"></div>
                <input
                  type="text"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  placeholder="https://api.example.com/users"
                  className="relative w-full px-5 py-4 bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-semibold mb-3 text-slate-300 group-hover:text-purple-400 transition-colors">
                HTTP Method
              </label>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all"></div>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="relative w-full px-5 py-4 bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                >
                  <option value="GET" className="bg-slate-900">GET</option>
                  <option value="POST" className="bg-slate-900">POST</option>
                  <option value="PUT" className="bg-slate-900">PUT</option>
                  <option value="DELETE" className="bg-slate-900">DELETE</option>
                  <option value="PATCH" className="bg-slate-900">PATCH</option>
                </select>
              </div>
            </div>
          </div>

          {/* Advanced Options Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full mb-4 px-4 py-2 text-sm text-slate-400 hover:text-purple-400 transition-colors flex items-center justify-center gap-2"
          >
            <svg className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {showAdvanced ? 'Hide' : 'Show'} Advanced Options (Headers & Body)
          </button>

          {/* Advanced Options */}
          {showAdvanced && (
            <div className="space-y-4 mb-6">
              <div className="group">
                <label className="block text-sm font-semibold mb-3 text-slate-300 group-hover:text-purple-400 transition-colors">
                  Headers (JSON)
                </label>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all"></div>
                  <textarea
                    value={headers}
                    onChange={(e) => setHeaders(e.target.value)}
                    placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
                    rows={3}
                    className="relative w-full px-5 py-4 bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-mono text-sm"
                  />
                </div>
              </div>

              {(method === 'POST' || method === 'PUT' || method === 'PATCH') && (
                <div className="group">
                  <label className="block text-sm font-semibold mb-3 text-slate-300 group-hover:text-purple-400 transition-colors">
                    Request Body (JSON)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all"></div>
                    <textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder='{"title": "Test", "body": "Content", "userId": 1}'
                      rows={5}
                      className="relative w-full px-5 py-4 bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-mono text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleGenerateTests}
            disabled={loading}
            className="group relative w-full overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-xl blur-xl group-hover:blur-2xl transition-all"></div>
            <div className="relative px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-500 hover:via-pink-500 hover:to-orange-500 disabled:from-slate-700 disabled:via-slate-700 disabled:to-slate-700 rounded-xl font-bold text-lg transition-all transform group-hover:scale-[1.02] active:scale-[0.98] disabled:scale-100">
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Tests...
                </span>
              ) : (
                'Generate Tests with AI'
              )}
            </div>
          </button>

          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            </div>
          )}
        </div>

        {tests.length > 0 && (
          <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold">Generated Tests</h2>
              </div>
              <button
                onClick={handleExecuteTests}
                disabled={executing}
                className="group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl blur-lg group-hover:blur-xl transition-all"></div>
                <div className="relative px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-slate-700 disabled:to-slate-700 rounded-xl font-bold transition-all transform group-hover:scale-105 active:scale-95 disabled:scale-100">
                  {executing ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Running...
                    </span>
                  ) : (
                    'Execute All Tests'
                  )}
                </div>
              </button>
            </div>

            <div className="grid gap-4">
              {tests.map((test, index) => (
                <div
                  key={test.id}
                  className="group relative overflow-hidden backdrop-blur-sm bg-slate-900/30 border border-white/5 rounded-2xl p-6 hover:border-purple-500/30 transition-all"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-2xl group-hover:blur-3xl transition-all"></div>
                  
                  <div className="relative flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold mb-2 text-white">{test.name}</h3>
                      <p className="text-slate-400 text-sm mb-3">{test.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-300 text-xs font-medium">
                          {test.method}
                        </span>
                        <span className="px-3 py-1 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-300 text-xs font-mono truncate max-w-md">
                          Expected: {test.expected_status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold">
                  Test Results
                  <span className="ml-3 text-xl text-slate-400">
                    {results.filter(r => r.status === 'passed').length}/{results.length} Passed
                  </span>
                </h2>
              </div>

              {/* Export Dropdown */}
              <div className="relative group/export">
                <button className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl blur-lg group-hover/export:blur-xl transition-all"></div>
                  <div className="relative px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 rounded-xl font-bold transition-all flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-56 opacity-0 invisible group-hover/export:opacity-100 group-hover/export:visible transition-all z-10">
                  <div className="backdrop-blur-xl bg-slate-900/95 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                    <button
                      onClick={exportAsJSON}
                      className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors flex items-center gap-3 group/item"
                    >
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover/item:bg-blue-500/30 transition-colors">
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold text-white">Export as JSON</div>
                        <div className="text-xs text-slate-400">Download complete data</div>
                      </div>
                    </button>

                    <button
                      onClick={exportAsCSV}
                      className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors flex items-center gap-3 group/item"
                    >
                      <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center group-hover/item:bg-emerald-500/30 transition-colors">
                        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold text-white">Export as CSV</div>
                        <div className="text-xs text-slate-400">Spreadsheet format</div>
                      </div>
                    </button>

                    <button
                      onClick={copyToClipboard}
                      className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors flex items-center gap-3 group/item"
                    >
                      <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover/item:bg-purple-500/30 transition-colors">
                        <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold text-white">Copy to Clipboard</div>
                        <div className="text-xs text-slate-400">Quick share</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {results.map((result, index) => (
                <div
                  key={result.test_id}
                  className="group relative overflow-hidden backdrop-blur-sm bg-slate-900/30 border border-white/5 rounded-2xl p-6 hover:border-blue-500/30 transition-all"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl group-hover:blur-3xl transition-all"></div>
                  
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{result.test_name}</h3>
                          <p className="text-slate-400 text-sm">{result.duration_ms}ms</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-4 py-2 ${getStatusColor(result.status)} bg-opacity-20 border border-current rounded-xl font-bold text-sm uppercase tracking-wide`}>
                          {result.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {result.response_status && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-slate-500 font-medium">Status Code:</span>
                          <span className={`px-2 py-1 rounded-lg font-mono ${
                            result.response_status >= 200 && result.response_status < 300
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}>
                            {result.response_status}
                          </span>
                        </div>
                      )}

                      {result.response_body && (
                        <div className="mt-3">
                          <details className="group/details">
                            <summary className="cursor-pointer text-sm font-semibold text-slate-300 hover:text-purple-400 transition-colors flex items-center gap-2">
                              <svg className="w-4 h-4 transition-transform group-open/details:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              View Response
                            </summary>
                            <div className="mt-3 p-4 bg-slate-950/50 border border-white/5 rounded-xl overflow-x-auto">
                              <pre className="text-xs text-slate-300 font-mono">
                                {JSON.stringify(result.response_body, null, 2)}
                              </pre>
                            </div>
                          </details>
                        </div>
                      )}

                      {result.errors.length > 0 && (
                        <div className="mt-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                          <p className="text-red-400 font-semibold text-sm mb-2">Errors:</p>
                          <ul className="space-y-1">
                            {result.errors.map((err, i) => (
                              <li key={i} className="text-red-300 text-sm flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span className="font-mono">{err}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
