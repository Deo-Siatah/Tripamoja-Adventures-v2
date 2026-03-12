import { useState } from "react";
import { 
  Users, MapPin, Sparkles, UserPlus, 
  MessageCircle, Compass, CheckCircle2, Wallet,
  TrendingDown, ArrowRight, ShieldCheck
} from "lucide-react";
import { aiPool } from "../api/api";

export default function Pooling() {
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState(20000);
  const [personality, setPersonality] = useState("adventure");
  const [activities, setActivities] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [joinedPool, setJoinedPool] = useState(null);
  const [contacted, setContacted] = useState([]);

  const activityOptions = ["safari", "photography", "hiking", "swimming", "sunset", "stargazing", "waterfalls"];

  function toggleActivity(act) {
    setActivities(prev => prev.includes(act) ? prev.filter(a => a !== act) : [...prev, act]);
  }

  async function findPool() {
    if (!destination) { alert("Destination required"); return; }
    setLoading(true);

    const user = {
      id: 1, // Current User
      name: "You",
      lat: -1.292,
      lng: 36.821,
      budget: Number(budget),
      personality,
      activities,
      destination,
    };

    try {
      const data = await aiPool([user]); 
      setResults(data);
      setJoinedPool(null);
      setContacted([]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F5F2] py-16 font-inter">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-[#355E3B] mb-4 flex items-center justify-center gap-3">
            <Sparkles className="text-[#E76F51]" size={40} />
            Smart Pooling
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Our AI analyzes trip costs and traveler compatibility to find you the most affordable group.
          </p>
        </div>

        {/* --- INPUT FORM --- */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Destination</label>
              <input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="e.g. Masai Mara" className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#355E3B] font-bold outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Your Budget (KES)</label>
              <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#355E3B] font-bold outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Style</label>
              <select value={personality} onChange={(e) => setPersonality(e.target.value)} className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#355E3B] font-bold outline-none appearance-none">
                <option value="adventure">Adventure</option>
                <option value="relaxation">Relaxation</option>
                <option value="nature">Nature</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>
          </div>

          <div className="mb-8">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 block">Interest Tags</label>
            <div className="flex flex-wrap gap-2">
              {activityOptions.map((act) => (
                <button key={act} onClick={() => toggleActivity(act)} className={`px-5 py-2 rounded-full text-xs font-bold capitalize transition-all border ${activities.includes(act) ? "bg-[#355E3B] text-white border-[#355E3B]" : "bg-white text-gray-500 border-gray-200 hover:border-[#355E3B]"}`}>{act}</button>
              ))}
            </div>
          </div>

          <button onClick={findPool} disabled={loading} className="w-full bg-[#E76F51] text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:shadow-[#E76F51]/30 transition-all flex items-center justify-center gap-3">
            {loading ? <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full" /> : "Calculate Savings & Find Pools"}
          </button>
        </div>

        {/* --- RESULTS --- */}
        {results && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* DESTINATION HEADER */}
            <div className="bg-[#355E3B] p-8 rounded-[2.5rem] text-white flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h2 className="text-3xl font-black">{results.destination}</h2>
                <p className="opacity-80 font-medium">Standard Solo Cost: KES {results.base_solo_cost?.toLocaleString()}</p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20">
                <p className="text-[10px] uppercase font-black opacity-70">Target Budget Match</p>
                <p className="text-2xl font-black">KES {budget.toLocaleString()}</p>
              </div>
            </div>

            {/* POOLS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {Object.entries(results.pools).map(([poolId, pool]) => (
                <div key={poolId} className={`relative bg-white rounded-[2.5rem] p-8 border-2 transition-all ${pool.is_your_ai_recommended_pool ? 'border-[#355E3B] shadow-2xl scale-[1.02]' : 'border-gray-100 opacity-80'}`}>
                  {pool.is_your_ai_recommended_pool && (
                    <div className="absolute -top-4 left-8 bg-[#355E3B] text-white px-4 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-2">
                      <ShieldCheck size={12}/> AI Recommended Match
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="text-gray-400 font-black text-[10px] uppercase">Pool Group #{parseInt(poolId) + 1}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Users size={18} className="text-[#355E3B]"/>
                        <span className="font-bold text-xl">{pool.pool_size} Travelers Joining</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black text-[#E76F51] bg-[#E76F51]/10 px-3 py-1 rounded-lg">-{Math.round((pool.estimated_savings / pool.original_solo_price) * 100)}% SAVING</span>
                    </div>
                  </div>

                  {/* Pricing Comparison */}
                  <div className="bg-gray-50 rounded-3xl p-6 mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 font-bold line-through">KES {pool.original_solo_price.toLocaleString()}</p>
                      <p className="text-2xl font-black text-gray-800">KES {pool.new_pooled_price.toLocaleString()}</p>
                      <p className="text-[10px] font-bold text-[#355E3B]">Avg Pool Budget: KES {pool.pool_average_budget?.toLocaleString()}</p>
                    </div>
                    <ArrowRight className="text-gray-300" />
                    <div className="text-right text-[#355E3B]">
                      <TrendingDown size={32} />
                      <p className="font-black text-sm">Save KES {pool.estimated_savings.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Members */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {pool.members.map(member => (
                      <div key={member.id} className="flex items-center gap-2 bg-white border border-gray-100 px-3 py-1.5 rounded-xl shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-bold text-gray-600">{member.name} <span className="text-[9px] opacity-50 uppercase">({member.personality})</span></span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setJoinedPool(poolId)}
                    className={`w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 ${joinedPool === poolId ? 'bg-[#355E3B] text-white' : 'bg-[#F8F5F2] text-[#355E3B] hover:bg-gray-200'}`}
                  >
                    {joinedPool === poolId ? <><CheckCircle2 size={20}/> Secured Your Spot</> : <><UserPlus size={20}/> Join & Lock Price</>}
                  </button>
                </div>
              ))}
            </div>

            {/* INDIVIDUAL MATCHES */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-50">
  <h3 className="font-black text-2xl mb-8 text-[#355E3B] flex items-center gap-3">
    <Sparkles className="text-[#E76F51]" size={24} />
    Potential Travellers
  </h3>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {results.compatibility_matches.map((match) => (
      <div 
        key={match.id} 
        className="group relative p-6 rounded-[2rem] border border-gray-100 bg-white hover:border-[#355E3B]/30 hover:shadow-md transition-all duration-300"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Avatar with Personality Initial */}
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-[#355E3B] to-[#1e3621] text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">
                {match.name.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-50">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
              </div>
            </div>
            
            <div>
              <p className="font-black text-lg text-gray-800 leading-tight">{match.name}</p>
              <span className="text-[10px] font-bold text-[#E76F51] uppercase tracking-widest bg-[#E76F51]/10 px-2 py-0.5 rounded">
                {match.personality || "Adventurer"}
              </span>
            </div>
          </div>

          <button 
            onClick={() => setContacted([...contacted, match.id])} 
            className={`p-3 rounded-2xl transition-all ${
              contacted.includes(match.id) 
              ? 'bg-gray-100 text-gray-400' 
              : 'bg-[#F8F5F2] text-[#355E3B] hover:bg-[#355E3B] hover:text-white'
            }`}
          >
            {contacted.includes(match.id) ? <CheckCircle2 size={22} /> : <MessageCircle size={22} />}
          </button>
        </div>

        {/* --- AI Compatibility Score Bar --- */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-tighter">Vibe Match</p>
            <p className="text-sm font-black text-[#355E3B]">{match.compatibility}%</p>
          </div>
          
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#E76F51] via-[#f3a683] to-[#355E3B] transition-all duration-1000 ease-out"
              style={{ width: `${match.compatibility}%` }}
            />
          </div>
          
          <p className="text-xs text-gray-500 italic mt-3 flex items-start gap-1.5">
            <Compass size={14} className="text-[#355E3B] shrink-0 mt-0.5" />
            <span>"{match.match_reason}"</span>
          </p>
        </div>
      </div>
    ))}
  </div>
</div>

          </div>
        )}
      </div>
    </div>
  );
}