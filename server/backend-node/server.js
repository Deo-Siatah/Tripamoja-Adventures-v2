const express = require("express");
const aiRoutes = require("./routes/Airoutes");
const cors = require("cors");

const app = express();
const PORT = 5000;

// middleware
app.use(express.json());

// allow only localhost:5173
app.use(cors({
  origin: "http://localhost:5173"
}));

app.use("/api/ai", aiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
