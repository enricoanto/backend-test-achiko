const express = require('express')
const app = express()
const port = 3000
const admin = require('firebase-admin')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

var serviceAccount = require('./backend-test-14294-firebase-adminsdk-bp4ku-282686444a.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://backend-test-14294-default-rtdb.firebaseio.com"
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const database = admin.database()
app.post('/register', async (req, res) => {
    try {
        const user = {
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 10)
        }
        const data = await database.ref(`/users/${req.body.username}`).get()
        let newData = JSON.stringify(data)
        if (newData === 'null') {
            const input = await database.ref(`/users/${req.body.username}`).set(user)
            res.status(201).json(input)
        } else {
            res.status(400).json({ name: 'Bad Request', msg: 'Username already exist.' })
        }

    } catch (err) {
        res.status(500).json(err)
    }
})

app.post('/login', async (req, res) => {
    try {
        const data = await database.ref(`/users/${req.body.username}`).get()
        let newData = JSON.stringify(data)
        newData = JSON.parse(newData)
        if (!newData) {
            res.status(401).json({ name: 'Unauthorized', msg: 'username and password failed' })
        } else if (!bcrypt.compareSync(req.body.password, newData.password)) {
            res.status(401).json({ name: 'Unauthorized', msg: 'username and password failed' })
        } else {
            let access_token = jwt.sign(newData, 'secret')
            res.status(201).json(access_token)
        }
    } catch (err) {
        res.status(500).json(err)
    }
})

app.use((req, res, next) => {
    const decoded = jwt.verify(req.headers.access_token, 'secret')
    database.ref(`/users/${decoded.username}`).get()
        .then(data => {
            let newData = JSON.stringify(data)
            newData = JSON.parse(newData)
            req.userData = newData
            next()
        })
        .catch(err => {
            res.status(500).json(err)
        })
})
app.use('/profil', async (req, res) => {
    try {
        const data = await database.ref(`/users/${req.userData.username}`).get()
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json(err)
    }
})
app.listen(port, () => {
    console.log(`app listening to port ${port}`)
})