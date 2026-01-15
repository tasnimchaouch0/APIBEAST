import { useState } from 'react'
import axios from 'axios'
import Header from './components/Header'
import BackgroundOrbs from './components/BackgroundOrbs'
import SavedSuitesPanel from './components/SavedSuitesPanel'
import TemplatesPanel from './components/TemplatesPanel'
import TestForm from './components/TestForm'
import TestList from './components/TestList'
import ResultsPanel from './components/ResultsPanel'

const API_BASE_URL = 'http://127.0.0.1:8080/api'

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
  const [savedSuites, setSavedSuites] = useState(() => {
    const saved = localStorage.getItem('apibeast-test-suites')
    return saved ? JSON.parse(saved) : []
  })
  const [showSavedSuites, setShowSavedSuites] = useState(false)

  const loadTemplate = (template) => {
    setEndpoint(template.endpoint)
    setMethod(template.method)
    setHeaders(JSON.stringify(template.headers, null, 2))
    setBody(template.body)
    setShowAdvanced(!!template.headers || !!template.body)
    setShowTemplates(false)
    setError(null)
    setTests([])
    setResults([])
  }

  const saveTestSuite = () => {
    const name = prompt('Enter a name for this test suite:')
    if (!name) return
    
    const suite = {
      id: Date.now(),
      name,
      endpoint,
      method,
      headers,
      body,
      tests,
      timestamp: new Date().toISOString()
    }
    
    const updated = [...savedSuites, suite]
    setSavedSuites(updated)
    localStorage.setItem('apibeast-test-suites', JSON.stringify(updated))
    alert('Test suite saved!')
  }

  const loadTestSuite = (suite) => {
    setEndpoint(suite.endpoint)
    setMethod(suite.method)
    setHeaders(suite.headers)
    setBody(suite.body)
    setTests(suite.tests)
    setShowAdvanced(!!suite.headers || !!suite.body)
    setShowSavedSuites(false)
    setError(null)
    setResults([])
  }

  const deleteTestSuite = (id) => {
    if (!confirm('Are you sure you want to delete this test suite?')) return
    const updated = savedSuites.filter(s => s.id !== id)
    setSavedSuites(updated)
    localStorage.setItem('apibeast-test-suites', JSON.stringify(updated))
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white relative overflow-hidden">
      <BackgroundOrbs />

      <div className="relative max-w-7xl mx-auto px-6 py-12">
        <Header />

        <SavedSuitesPanel
          savedSuites={savedSuites}
          showSavedSuites={showSavedSuites}
          setShowSavedSuites={setShowSavedSuites}
          loadTestSuite={loadTestSuite}
          deleteTestSuite={deleteTestSuite}
        />

        <TemplatesPanel
          showTemplates={showTemplates}
          setShowTemplates={setShowTemplates}
          loadTemplate={loadTemplate}
        />

        <TestForm
          endpoint={endpoint}
          setEndpoint={setEndpoint}
          method={method}
          setMethod={setMethod}
          headers={headers}
          setHeaders={setHeaders}
          body={body}
          setBody={setBody}
          loading={loading}
          error={error}
          showAdvanced={showAdvanced}
          setShowAdvanced={setShowAdvanced}
          handleGenerateTests={handleGenerateTests}
        />

        <div>
          <TestList
            tests={tests}
            saveTestSuite={saveTestSuite}
            executing={executing}
            handleExecuteTests={handleExecuteTests}
          />

          <ResultsPanel
            results={results}
            endpoint={endpoint}
            method={method}
          />
        </div>
      </div>
    </div>
  )
}

export default App
