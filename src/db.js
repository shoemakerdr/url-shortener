const MongoClient = require('mongodb').MongoClient
const databaseURL = process.env.MLAB_URI || require('./dburl')

const randomHex = () => {
    const rand = Math.ceil(Math.random() * 1000000)
    return Number(rand).toString(16)
}

const withHttpUrl = url => {
    const rgx = new RegExp(/(https?:\/\/)/)
    return rgx.test(url) ? url : `http://${url}` 
}

const findOrInsertURL = (url, res) => {
    MongoClient.connect(databaseURL, (err, db) => {
        if (err) return console.error(err)

        console.log('MongoClient connected.')

        const urls = db.collection('urls')

        urls.findOne({
            original_url: url
        }, {fields: {
            _id: 0,
            original_url: 1,
            short_url: 1
        }}).then(doc => {
            if (doc === null) {
                const hex = randomHex()
                const urlDoc = {original_url: url, short_url: hex}
                urls.insertOne(Object.assign({}, urlDoc))
                    .then(result => {
                        console.log('inserted new url')
                        console.log(urlDoc)
                        res.json(urlDoc)
                        db.close()
                    }).catch(console.error)
            }
            else {
                console.log('found url')
                res.json(doc)
            }
            db.close()
        }).catch(console.error)
    })
}

const findShortened = (shortened, res) => {
    MongoClient.connect(databaseURL, (err, db) => {
        if (err) return console.error(err)

        console.log('MongoClient connected.')

        const urls = db.collection('urls')

        urls.findOne({ short_url: shortened }, {fields: {_id: 0, original_url: 1}})
            .then(doc => {
                if (doc === null) {
                    console.log('shortened url not found')
                    res.error()
                }
                else {
                    console.log(`shortened found-- URL is ${doc.original_url}`)
                    res.redirectTo(withHttpUrl(doc.original_url))
                }
                db.close()
            }).catch(console.error)
    })
}

module.exports = {
    findOrInsertURL,
    findShortened
}
