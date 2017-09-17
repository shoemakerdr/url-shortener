const path = require('path')
const express = require('express')
const { timestamp } = require('./timestamp')
const app = express()

const indexPath = path.join(__dirname, '../', 'public', 'index.html')

app.use('/', express.static(path.normalize(indexPath)))

app.get('/', (req,res) => {
    res.sendFile(path.normalize(indexPath))
})

app.get('/:timestamp', (req, res) => {
    const ts = req.params.timestamp
    res.json(timestamp(ts))
})

app.listen(process.env.PORT || 8000)
