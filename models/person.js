const mongoose = require('mongoose')

const url = process.env.MONGDO_PERSON_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(res => {
        console.log('connected to MongoDB')
    })
    .catch( (error) => {
        console.log('error connecting to MongoDB', error.message)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

personSchema.set('toJSON', {
    transform: (document, returnedPerson) => {
        returnedPerson.id = returnedPerson._id.toString()
        delete returnedPerson._id
        delete returnedPerson.__v
    }
})

module.exports = mongoose.model('Person', personSchema)