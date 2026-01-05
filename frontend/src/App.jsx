import { useState } from 'react'
import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8080/api'

function App() {
  const [endpoint, setEndpoint] = useState('')
  const [method, setMethod] = useState('GET')
  const [loading, setLoading] = useState(false)
  const [tests, setTests] = useState([])
  const [error, setError] = useState(null)
  const [executing, setExecuting] = useState(false)
  const [results, setResults] = useState([])

  const handleGenerateTests = async () => {
    if (!endpoint) {
      setError('Please enter an API endpoint')
      return
    }

    setLoading(true)
    setError(null)
    setTests([])

    try {
      const response = await axios.post(`${API_BASE_URL}/generate-tests`, {
        endpoint,
        method
      })

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
      case 'passed': return 'bg-green-500'
      case 'failed': return 'bg-red-500'
      case 'error': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-75"></div>
        <div className="absolute -bottom-20 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-150"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-16 text-center">
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

        {/* Main Card */}
        <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl p-8 mb-8">
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
                  className="relative w-full px-5 py-4 bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder:text-slate-600"
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
                  className="relative w-full px-5 py-4 bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none cursor-pointer"
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
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm">
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
          <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl p-8 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">Generated Tests</h2>
                <p className="text-slate-400">
                  <span className="text-purple-400 font-semibold">{tests.length}</span> test cases ready
                </p>
              </div>
              <button
                onClick={handleExecuteTests}
                disabled={executing}
                className="group relative px-6 py-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur-lg group-hover:blur-xl transition-all"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:from-slate-700 disabled:to-slate-700 px-6 py-3 rounded-xl font-semibold transition-all transform group-hover:scale-105 active:scale-95 disabled:scale-100">
                  {executing ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Executing...
                    </span>
                  ) : (
                    'Execute All Tests'
                  )}
                </div>
              </button>
            </div>

            <div className="space-y-3">
              {tests.map((test, idx) => (
                <div 
                  key={test.id} 
                  className="group relative overflow-hidden"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-slate-900/30 backdrop-blur-sm border border-white/5 rounded-xl p-5 hover:border-purple-500/30 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-purple-500/20">
                        <span className="text-purple-400 font-bold">{idx + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 text-white group-hover:text-purple-300 transition-colors">
                          {test.name}
                        </h3>
                        <p className="text-slate-400 text-sm mb-3 line-clamp-2">{test.description}</p>
                        <div className="flex flex-wrap gap-3 text-xs">
                          <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-full font-medium">
                            {test.method}
                          </span>
                          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-full font-medium">
                            Status: {test.expected_status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-3">Test Results</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-emerald-400 font-semibold">
                    {results.filter(r => r.status === 'passed').length} Passed
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-400 font-semibold">
                    {results.filter(r => r.status === 'failed').length} Failed
                  </span>
                </div>
                <div className="text-slate-400">
                  Total: {results.length}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {results.map((result, idx) => (
                <div 
                  key={result.test_id} 
                  className="group relative overflow-hidden"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className={`absolute inset-0 ${result.status === 'passed' ? 'bg-gradient-to-r from-emerald-500/10 to-green-500/10' : 'bg-gradient-to-r from-red-500/10 to-orange-500/10'} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                  <div className="relative bg-slate-900/30 backdrop-blur-sm border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all">
                    <div className="flex items-start gap-4">
                      <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${getStatusColor(result.status)} shadow-lg`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg text-white">{result.test_name}</h3>
                          <span className="text-slate-400 text-sm font-mono bg-slate-800/50 px-2 py-1 rounded">
                            {result.duration_ms}ms
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">Status:</span>
                            <span className={`font-semibold uppercase ${result.status === 'passed' ? 'text-emerald-400' : 'text-red-400'}`}>
                              {result.status}
                            </span>
                          </div>
                          {result.response_status && (
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400">Response Code:</span>
                              <span className="text-white font-mono bg-slate-800/50 px-2 py-0.5 rounded">
                                {result.response_status}
                              </span>
                            </div>
                          )}
                          {result.errors.length > 0 && (
                            <div className="mt-3 p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                              <p className="font-semibold text-red-400 mb-2">Errors:</p>
                              <ul className="space-y-1">
                                {result.errors.map((err, i) => (
                                  <li key={i} className="text-red-300 text-xs flex items-start gap-2">
                                    <span className="text-red-500 mt-0.5">•</span>
                                    <span>{err}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
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
