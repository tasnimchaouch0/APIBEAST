export default function SavedSuitesPanel({ savedSuites, showSavedSuites, setShowSavedSuites, loadTestSuite, deleteTestSuite }) {
  return (
    <>
      <div className="mb-8 grid md:grid-cols-2 gap-4">
        <button
          onClick={() => setShowSavedSuites(!showSavedSuites)}
          className="group relative overflow-hidden w-full"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
          <div className="relative px-6 py-4 bg-gradient-to-r from-purple-600/10 to-pink-600/10 hover:from-purple-600/20 hover:to-pink-600/20 border border-purple-500/30 rounded-2xl transition-all flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold">Saved Test Suites</h3>
                <p className="text-sm text-slate-400">{savedSuites.length} saved</p>
              </div>
            </div>
            <svg className={`w-6 h-6 transition-transform ${showSavedSuites ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
      </div>

      {showSavedSuites && savedSuites.length > 0 && (
        <div className="mb-8 backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl p-6">
          <div className="grid md:grid-cols-2 gap-3">
            {savedSuites.map(suite => (
              <div key={suite.id} className="relative group bg-slate-900/30 border border-white/5 hover:border-purple-500/30 rounded-xl p-4 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-semibold text-white">{suite.name}</h5>
                  <button
                    onClick={() => deleteTestSuite(suite.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-slate-400 mb-2">{suite.tests.length} tests · {new Date(suite.timestamp).toLocaleDateString()}</p>
                <p className="text-xs text-slate-500 font-mono truncate mb-3">{suite.endpoint}</p>
                <button
                  onClick={() => loadTestSuite(suite)}
                  className="w-full px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-sm font-semibold text-purple-300 transition-colors"
                >
                  Load Suite
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
