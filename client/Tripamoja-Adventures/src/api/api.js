const API_BASE = "http://localhost:5000/api/ai"

/* AI Experience Search */
export default async function aiSearch(data) {

    const payload = {
        query: data.query,
        dates: data.dates || null,
        people: Number(data.people),
        travelMode: data.travelMode
    }

    const res = await fetch(`${API_BASE}/search`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })

    if(!res.ok){
        const error = await res.text()
        throw new Error(error || "AI search failed")
    }

    return res.json()
}


/* AI Pool Matching */
export  async function aiPool(tourists) {

    const payload = {tourists}
    console.log("🟢POOL PAYLOAD",payload);

    const res = await fetch(`${API_BASE}/pool`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ tourists })
    })

    if(!res.ok){
        const error = await res.text()
        throw new Error(error || "AI pooling failed")
    }

    const data = await res.json();
    console.log("🔵POOL RESPONSE", data);   // <-- log the parsed response
    return data;
   
}