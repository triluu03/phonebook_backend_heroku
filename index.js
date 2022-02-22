require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('body', (request, response) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


const Person = require('./models/person')


// Get Data of all Persons in the database
app.get('/api/persons', (request, response) => {
    Person.find({}).then(person => {
      response.json(person)
    })
})


// Get the basic information of the database
app.get('/info', (request, response) => {
    Person.find({}).then(person => {
      response.send("<p>Phonebook has info for " + JSON.stringify(person.length) + " people </p> <p>" + new Date() + "</p>")
    })
})


// Get Person by ID
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})


// Deleting Person by ID
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))

})


// Creating new person in the database
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({error: 'name missing'})
  }
  
  const person = new Person({
    name: body.name,
    number: body.number,
  })
  
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})


// Changing Person's information in the database
app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      console.log(updatedPerson)
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})



// Error handling middleware
const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send( { error: 'malformatted id' })
  }
  
  next(error)
}
app.use(errorHandler)



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})