import { exportAsJSON as exportAsJSONUtil, exportAsCSV as exportAsCSVUtil, copyToClipboard as copyToClipboardUtil, getStatusColor } from '../utils/exportUtils'

export default function ResultsPanel({ results, endpoint, method }) {
  const exportAsJSON = () => exportAsJSONUtil(results, endpoint, method)
  const exportAsCSV = () => exportAsCSVUtil(results)
  const copyToClipboard = () => copyToClipboardUtil(results)

  if (results.length === 0) return null

  return (
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
  )
}
