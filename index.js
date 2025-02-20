const express = require('express');
const app = express();
const cors = require('cors');

require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const jwt = require('jsonwebtoken');


// middlewares
app.use(cors(
    {
        origin: ['http://localhost:5173', 'https://akashsaha-02.web.app', 'https://akashsaha-02.firebase.app'],
        credentials: true
    }
));
app.use(express.json());

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Task Flow Server!');
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});