import { useState } from 'react'
import { Search, Calendar, Users, UserCheck, UsersRound, Zap } from 'lucide-react'
import  aiSearch from '../api/api.js'

export default function SearchBar({ onResults, onClear }) {
  const [experience, setExperience] = useState('')
  const [dates, setDates] = useState('')
  const [people, setPeople] = useState('1')
  const [travelMode, setTravelMode] = useState('pooling')
  const [loading, setLoading] = useState(false)

  async function handleSearch() {
    if (!experience) return

    try {
      setLoading(true)

      const data = await aiSearch({
        query: experience,
        dates,
        people,
        travelMode
      })

      if (onResults) {
        onResults(data.results || [])
      }

    } catch (err) {
      console.error("Search failed", err)
    } finally {
      setLoading(false)
    }
  }

  function clearSearch(){
    setExperience('')
    setDates('')
    setPeople('1')

    if(onClear){
      onClear()
    }
  }

  return (
    <div className="w-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-2 border border-white/50">
      <div className="flex flex-col gap-4 p-4">

        {/* Mode Selector */}
        <div className="flex justify-center md:justify-start">
          <div className="bg-[#F8F5F2] p-1.5 rounded-full flex items-center gap-1 border border-gray-100">
            <button
              onClick={() => setTravelMode('pooling')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all ${
                travelMode === 'pooling'
                ? 'bg-[#355E3B] text-white shadow-md'
                : 'text-gray-500 hover:text-[#355E3B]'
              }`}
            >
              <UsersRound size={16} />
              <span>Join a Pool (Budget)</span>
            </button>

            <button
              onClick={() => setTravelMode('private')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all ${
                travelMode === 'private'
                ? 'bg-[#8B5E3C] text-white shadow-md'
                : 'text-gray-500 hover:text-[#8B5E3C]'
              }`}
            >
              <UserCheck size={16} />
              <span>Private Journey</span>
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">

          <div className="md:col-span-5 relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E76F51]">
              <Zap size={20} />
            </div>

            <input
              type="text"
              placeholder="E.g. Chasing waterfalls, Sunset dhow cruise, Elephant rescue..."
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border-transparent rounded-[1.5rem] focus:bg-white focus:ring-2 focus:ring-[#355E3B]/20 transition-all outline-none text-[#355E3B] font-medium placeholder:text-gray-400"
            />

            <div className="absolute top-[-10px] left-6 bg-white px-2 text-[10px] font-black uppercase tracking-widest text-[#8B5E3C]">
              The Experience
            </div>
          </div>

          <div className="md:col-span-3 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Calendar size={18} />
            </div>

            <input
              type="text"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = "text")}
              placeholder="When?"
              value={dates}
              onChange={(e) => setDates(e.target.value)}
              className="w-full pl-11 pr-4 py-4 bg-gray-50/50 border-transparent rounded-[1.5rem] focus:bg-white outline-none text-gray-600 font-medium"
            />
          </div>

          <div className="md:col-span-2 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Users size={18} />
            </div>

            <select
              value={people}
              onChange={(e) => setPeople(e.target.value)}
              className="w-full pl-11 pr-4 py-4 bg-gray-50/50 border-transparent rounded-[1.5rem] focus:bg-white outline-none text-gray-600 font-medium appearance-none"
            >
              {[1, 2, 4, 6, '8+'].map((n) => (
                <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full h-[58px] bg-[#355E3B] text-white rounded-[1.5rem] hover:bg-[#355E3B]/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#355E3B]/20 group"
            >
              {loading ? "Searching..." : (
                <>
                  <div className="bg-white/20 p-2 rounded-full group-hover:rotate-12 transition-transform">
                    <Search size={18} />
                  </div>
                  <span className="font-bold">Explore</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Suggestions */}
        <div className="flex flex-wrap items-center gap-2 mt-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-2">Trending:</span>

          {['Wildlife Photography','Hidden Waterfalls','Masaai Culture','Deep Sea Fishing'].map((tag)=>(
            <button
              key={tag}
              onClick={() => setExperience(tag)}
              className="text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 hover:border-[#E76F51] hover:text-[#E76F51] transition-colors"
            >
              {tag}
            </button>
          ))}

          <button
            onClick={clearSearch}
            className="text-xs px-3 py-1.5 text-red-500 font-semibold"
          >
            Clear
          </button>
        </div>

      </div>
    </div>
  )
}