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
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
            APIBeast
          </h1>
          <p className="text-gray-400 text-lg">
            AI-Powered API Testing Suite
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Generate Tests</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">API Endpoint</label>
              <input
                type="text"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder="https://api.example.com/users"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>

            <button
              onClick={handleGenerateTests}
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:from-gray-600 disabled:to-gray-700 px-6 py-3 rounded-lg font-semibold transition-all"
            >
              {loading ? 'Generating Tests...' : 'Generate Tests with AI'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg">
              <p className="text-red-300">{error}</p>
            </div>
          )}
        </div>

        {tests.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">
                Generated Tests ({tests.length})
              </h2>
              <button
                onClick={handleExecuteTests}
                disabled={executing}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-2 rounded-lg font-semibold transition-all"
              >
                {executing ? 'Executing...' : 'Execute All Tests'}
              </button>
            </div>

            <div className="space-y-3">
              {tests.map((test) => (
                <div key={test.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{test.name}</h3>
                      <p className="text-gray-400 text-sm mb-2">{test.description}</p>
                      <div className="flex gap-4 text-sm">
                        <span className="text-gray-300">
                          <span className="font-medium">Method:</span> {test.method}
                        </span>
                        <span className="text-gray-300">
                          <span className="font-medium">Expected Status:</span> {test.expected_status}
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
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Test Results ({results.filter(r => r.status === 'passed').length}/{results.length} Passed)
            </h2>

            <div className="space-y-3">
              {results.map((result) => (
                <div key={result.test_id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-3 h-3 rounded-full mt-1.5 ${getStatusColor(result.status)}`} />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{result.test_name}</h3>
                        <span className="text-gray-400 text-sm">{result.duration_ms}ms</span>
                      </div>
                      
                      <div className="text-sm space-y-1">
                        <p className="text-gray-300">
                          <span className="font-medium">Status:</span>{' '}
                          <span className={result.status === 'passed' ? 'text-green-400' : 'text-red-400'}>
                            {result.status.toUpperCase()}
                          </span>
                        </p>
                        {result.response_status && (
                          <p className="text-gray-300">
                            <span className="font-medium">Response Code:</span> {result.response_status}
                          </p>
                        )}
                        {result.errors.length > 0 && (
                          <div className="mt-2">
                            <p className="font-medium text-red-400">Errors:</p>
                            <ul className="list-disc list-inside text-red-300">
                              {result.errors.map((err, i) => (
                                <li key={i}>{err}</li>
                              ))}
                            </ul>
                          </div>
                        )}
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
