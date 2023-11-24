const express=require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
var jwt = require('jsonwebtoken');
const app=express()
const port=process.env.PORT || 5000;

require('dotenv').config()
const cors=require('cors')
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)




app.use(express.json())
app.use(cors())






app.get('/',(req,res)=>{
  
    res.send('Forum  Server is Running')

})

app.listen(port)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u2o3a1l.mongodb.net/?retryWrites=true&w=majority`;

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
    // Send a ping to confirm a successful connection





    //jwt token


  app.post('/jwt',async(req,res)=>{
    const user=req.body
 const token=jwt.sign(user,process.env.SECRET_TOKEN,({expiresIn:'1hr'}))
res.send({token})

  })

























    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
