const path = require('path')
const express = require('express')
const shortener = require('./shortener')

const app = express()

const publicPath = path.join(__dirname, '../', 'public')
const html = path.normalize(path.join(publicPath, 'index.html'))

app.use('/', express.static(path.normalize(publicPath)))

app.get('/', (req,res) => {
    res.sendFile(html)
})

app.get('/:resource', (req, res) => {
    const resource = req.params.resource
    shortener(resource, res)
})

app.listen(process.env.PORT || 8000)
