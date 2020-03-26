const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const port = 3000;

app.use(express.static("../client/dist"));

app.get("/building.json", (req, res) => {
  res.header("Content-Type", "application/json");
  res.sendFile(path.resolve("../building.json"));
});

app.use("/setbuilding", express.json());
app.post("/setbuilding", (req, res) => {
  fs.writeFileSync(
    path.resolve("../building.json"),
    JSON.stringify(req.body, null, 2)
  );
  res.send();
});

app.listen(port, () => console.log(`http://localhost:${port}`));
