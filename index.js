const express = require('express')
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.38uxi.mongodb.net/volunteerNetwork?retryWrites=true&w=majority`;

const port = 5000

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send("hello from database")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const volunteerCollection = client.db("volunteerNetwork").collection("userWorks");
  const volunteerWorkCollection = client.db("volunteerNetwork").collection("allVolunteerWork");

  app.post('/addWork', (req, res) => {
      const userWork = req.body;
      volunteerCollection.insertOne(userWork)
      .then(result => {
          res.send(result.insertedCount > 0);
      })
  })
  
  app.get('/events', (req, res) => {
    volunteerCollection.find({email: req.query.email})
    .toArray((err, result) => {
      res.send(result);
      // res.redirect('/');
    })
  })

  app.delete('/delete/:id', (req, res) => {
    volunteerCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0);
    })
  })

  app.post('/allWork', (req, res) => {
    const allWork = req.body;
    volunteerWorkCollection.insertMany(allWork)
    .then(result => {
      console.log(result.insertedCount);
      res.send(result.insertedCount);
    })
  })

  app.get('/allVolunteerWork', (req, res) => {
    volunteerWorkCollection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })
  
});

app.listen(process.env.PORT || port)