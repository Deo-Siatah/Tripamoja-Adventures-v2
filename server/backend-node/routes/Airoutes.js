const express = require("express")
const router = express.Router()
const axios = require("axios")

const AI_URL = "http://localhost:8001"

router.post("/search", async(req,res) => {
    try {
        const response = await axios.post(`${AI_URL}/ai/search`,req.body)
        res.json(response.data)
    } catch (error) {
        console.error(error)
        res.status(500).json({
            error: "AI search failed"
        })
    }
})

router.post("/pool",async (req,res) => {
    try {
        const response = await axios.post(`${AI_URL}/ai/pool`,{
            tourists: req.body.tourists
        })
        res.json(response.data)
    } catch (error) {
        console.error(error)

        res.status(500).json({
            error: "AI pooling failed"
        })
    }
})

module.exports = router;