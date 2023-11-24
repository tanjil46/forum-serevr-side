const express=require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
var jwt = require('jsonwebtoken');
const app=express()
const port=process.env.PORT || 5000;

require('dotenv').config()
const cors=require('cors')
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)




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

    const userPostCollection=client.db('forumDB').collection('userPost')
    const totalUserCollection=client.db('forumDB').collection('user')
    const paymentCollection=client.db('forumDB').collection('payment')

    // user post

    app.post('/userpost',async(req,res)=>{
      const userPost=req.body
      console.log('user post',userPost)
      const result=await userPostCollection.insertOne(userPost)
      res.send(result)
    })
 
  app.get('/userpost',async(req,res)=>{
  //  const email=req.query.email
  //  const query={email:email}
  //  console.log(query)
   const result=await userPostCollection.find().toArray()
   res.send(result)




  })
      



  app.get('/post-count/:email',async(req,res)=>{
    const userEmail=req.params.email
    const query={email:userEmail}
    const toTalPost=await userPostCollection.countDocuments(query)
    res.send({toTalPost})
  })








    //jwt token


  app.post('/jwt',async(req,res)=>{
    const user=req.body
 const token=jwt.sign(user,process.env.SECRET_TOKEN,({expiresIn:'1hr'}))
res.send({token})

  })






 //User post


 
app.post('/users',async(req,res)=>{
  const user=req.body
  console.log('users',user)
  const query={email:user.email}
  const isUserMatch=await totalUserCollection.findOne(query)
  if(isUserMatch){
    return res.send({message:'User already Exits',insertedId:null})
  }
  const result=await totalUserCollection.insertOne(user)
  res.send(result)
  
  })



  app.get('/users',async(req,res)=>{
  
    const result= await totalUserCollection.find().toArray()
    res.send(result)
  })




    //PAYMENT CLIENT SECRET



    app.post('/create-payment-intent',async(req,res)=>{
      const {price}=req.body
    console.log('price ',price)
    
      const paymentIntent=await stripe.paymentIntents.create({
       amount:(price*100),
       currency:'usd',
       payment_method_types:['card']
    })
    
    res.send({
      clientSecret: paymentIntent.client_secret
    })
    
    })
    

















    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
