const express = require("express");
const MongoClient = require("mongodb").MongoClient;
let cors = require("cors");

const app = express();
app.use(cors());

let db;

async function connectDB() {
  let client = new MongoClient("mongodb://localhost:27017");
  await client.connect(client);
  db = client.db("db401test"); // database name
  console.log("Connected to MongoDB");
}

app.get("/test", async (req, res) => {
  let data = await db
    .collection("test")
    .find({})
    .project({ _id: 0, id: 1, nombre: 1, materia: 1 }) // proyectar solo los campos que quiero (1) o no quiero (0). Equivalente a SELECT id, nombre, materia FROM test
    .toArray();
  res.set("Access-Control-Expose-Headers", "X-Total-Count"); // para que el cliente pueda leer el header
  res.set("X-Total-Count", data.length); // el header con la cantidad de elementos
  res.json(data);
});

app.delete("/test/:id", async (req, res) => {
  let data = await db.collection("test").deleteOne({ id: req.params.id });
  res.json(data);
});

app.listen(3000, () => {
  connectDB();
  console.log("Server running on port 3000");
});
