const mongoose = require('mongoose')

// eslint-disable-next-line no-undef
const url = process.env.MONGDO_PERSON_URI

console.log('connecting to', url)

mongoose.connect(url)
	.then(console.log('connected to MongoDB'))
	.catch( (error) => {
		console.log('error connecting to MongoDB', error.message)
	})

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: 3,
	},
	number: {
		type: String,
		minlength: 8,
		validate: {
			validator: (number) => {
				return /\d{2}\d?-\d*/.test(number)
			},
			message: props => `${props.value} is not valid phone number!`
		}
	}
})

personSchema.set('toJSON', {
	transform: (document, returnedPerson) => {
		returnedPerson.id = returnedPerson._id.toString()
		delete returnedPerson._id
		delete returnedPerson.__v
	}
})

module.exports = mongoose.model('Person', personSchema)