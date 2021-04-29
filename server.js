const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
//  var id = req.params.gonderi_id;
//  var o_id = new ObjectId(id);
//  db.test.find({_id:o_id})

const app = express();
app.use(cors());
app.use(bodyParser.json());

const MongoClient = require("mongodb").MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dl4gc.mongodb.net/eazy-buy?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get("/", (req, res) => {
  res.send("Hello World");
});

client.connect((err) => {
  const productCollection = client.db("eazy-buy").collection("products");
  const orderCollection = client.db("eazy-buy").collection("orders");

  app.post("/addProduct", (req, res) => {
    productCollection.insertOne(req.body).then((InsRes) => {
      res.send(InsRes);
    });
  });
  //Get List of products
  app.get("/getProducts", (req, res) => {
    productCollection.find({}).toArray((err, data) => res.send(data));
  });
  //Get List of Orders
  app.get("/getOrders", (req, res) => {
    orderCollection.find({ email: req.query.email }).toArray((err, data) => res.send(data));
  });
  //Get single Product by ID
  app.get("/getProduct", (req, res) => {
    productCollection.find({ _id: ObjectId(req.query.id) }).toArray((err, data) => res.send(data[0]));
  });
  //Delete a Product
  app.get("/deleteProduct", (req, res) => {
    productCollection.deleteOne({ _id: ObjectId(req.query.id) }).then((delRes) => res.send(delRes));
  });
  //placeOrder
  app.post("/placeOrder", (req, res) => {
    orderCollection.insertOne(req.body).then((InsRes) => {
      res.send(InsRes);
    });
  });

  console.log("Connected");
});

app.listen(process.env.PORT || 5000);
