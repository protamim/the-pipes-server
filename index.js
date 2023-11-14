const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
var cors = require('cors')
const app = express()
const port = process.env.PORT || 3000;
// env
require('dotenv').config()
// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.vjc6ohr.mongodb.net/?retryWrites=true&w=majority`;

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

    // database information
    const database = client.db("thePipes");
    const pipeServices = database.collection("pipeServices");
    const booking = database.collection("booking");

    // get/find:: All services API
    app.get('/services', async(req, res)=> {
        const cursor = pipeServices.find().toArray()
        const result = await cursor;
        res.send(result)
    })

    // get/find:: Booking API
    app.get('/booking', async(req, res)=> {
        const cursor = booking.find().toArray()
        const result = await cursor;
        res.send(result)
    })

    // get/find:: get a specific product by ID
    app.get('/services/:id', async(req, res)=> {
      const id = req.params.id.toString();
      const query = {"_id": new ObjectId(id)}
      const result = await pipeServices.findOne(query);
      res.send(result);
    })

    // post:: insert document to mongoDB
    app.post('/services', async(req, res)=> {
        const receivedData = req.body;
         // Insert the defined document into the "pipeServices" collection
         const result = await pipeServices.insertOne(receivedData);
         res.send(result);
    })

    // Post:: insert services by users to the database
    app.post('/booking', async(req, res)=> {
      const info = req.body;
      const result = await booking.insertOne(info);
      res.send(result);
    })

    // PUT:: update operation
    app.put('/services/:id', async(req, res)=> {
      const body = req.body;
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          ...body,
        }
      };
      const result = await pipeServices.updateOne(filter, updateDoc, options);
      res.send(result);
    })

    // delete:: delete your service
    app.delete('/services/:id', async(req, res)=> {
      const query = {_id: new ObjectId(req.params.id)};
      const result = await pipeServices.deleteOne(query);
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
  res.send('The pipes server is running all the time..........')
})

app.listen(port, () => {
  console.log(`The pipes app listening on port ${port}`)
})