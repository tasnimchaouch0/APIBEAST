import { API_TEMPLATES } from '../data/apiTemplates'

export default function TemplatesPanel({ showTemplates, setShowTemplates, loadTemplate }) {
  return (
    <div className="mb-8">
      <button
        onClick={() => setShowTemplates(!showTemplates)}
        className="group relative overflow-hidden w-full hidden"
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
  )
}
