const db = require('./db')

const isValidURL = url => {
    // regular expression to for URL testing
    const rgx = new RegExp(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)
    return rgx.test(url)
}

const shortener = (resource, response) => {
    const responses = {
        error: () => response.json({error: 'Invalid input'}),
        json: doc => response.json(doc),
        redirectTo: url => response.redirect(url)
    }

    if (isValidURL(resource)) {
        db.findOrInsertURL(resource, responses)
    }
    else db.findShortened(resource, responses)
}

module.exports = shortener
