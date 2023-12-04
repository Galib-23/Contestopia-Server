const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());





const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ogz7mxs.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const contestCollection = client.db("contestDB").collection("contest");
    const registeredCollection = client.db('contestDB').collection("registered");
    const userCollection = client.db('contestDB').collection("users");


    //-------------GETS-------------
    app.get('/contest', async (req, res) => {
        const result = await contestCollection.find().toArray();
        res.send(result);
    })
    app.get('/contest/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await contestCollection.findOne(query);
        res.send(result);
    })
    app.get('/registered', async (req, res) => {
      const result = await registeredCollection.find().toArray();
      res.send(result);
    })



    //-------------POSTS----------------
    app.post('/registered', async(req, res) => {
      const registeredContest = req.body;
      const result = await registeredCollection.insertOne(registeredContest);
      res.send(result);
    })
    app.post('/users', async (req, res) => {
      const user = req.body;
      const query = {email: user.email};
      const existingUser = await userCollection.findOne(query);
      if(existingUser){
        return res.send({message: 'user exist', insertedId: null});
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    })






    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('contestopia is running ...');
})
app.listen(port, () => {
    console.log(`contestopia running on port ${port}`);
})