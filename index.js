const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('body', (request, response) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      id: 1,
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: 2,
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: 3,
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: 4,
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const number = persons.length
    const date = new Date()
    response.send("<p>Phonebook has info for " + JSON.stringify(number) + " people </p> <p>" + date + "</p>")
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const person = request.body
  const name = person.name
  const duplicate = persons.find(person => person.name === name)

  if (!person.name) {
    return response.status(400).json({
      error: "person's name is missing"
    })
  }

  if (duplicate) {
    return response.status(400).json({
      error: "name must be unique"
    })
  }
  
  const newPerson = {
    id: Math.floor(Math.random()*1000),
    name: person.name,
    number: person.number
  }
  persons = persons.concat(newPerson)

  response.json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})