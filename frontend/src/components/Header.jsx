export default function Header() {
  return (
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
  )
}
