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
        console.log('Connecting to the database');
        const database = client.db("taskflow");
        const users = database.collection("users");
        const tasks = database.collection("tasks");


        // jwt api

        app.post('/jwt', async (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            res.send({ token })
        });

        // middleware functions
        const verifyToken = (req, res, next) => {
            // console.log(req.headers.authorization)
            if (!req.headers.authorization) {
                return res.status(401).send({ message: 'Unauthorized request' });
            }

            const token = req.headers.authorization.split(' ')[1];
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(403).send({ message: 'Forbidden request' });
                }
                req.decoded = decoded;
                next();
            });
        }



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