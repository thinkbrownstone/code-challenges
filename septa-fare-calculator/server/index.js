const express = require('express')
const fares = require('../fares.json')

const PORT = process.env.PORT || 3001

const app = express()


app.get('/api/fares', (req, res) => {
    res.send(fares)
})

app.listen(PORT, () => {})