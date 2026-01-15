export default function TestForm({
  endpoint,
  setEndpoint,
  method,
  setMethod,
  headers,
  setHeaders,
  body,
  setBody,
  loading,
  error,
  showAdvanced,
  setShowAdvanced,
  handleGenerateTests
}) {
  return (
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

      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full mb-4 px-4 py-2 text-sm text-slate-400 hover:text-purple-400 transition-colors flex items-center justify-center gap-2"
      >
        <svg className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        {showAdvanced ? 'Hide' : 'Show'} Advanced Options (Headers & Body)
      </button>

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
  )
}
