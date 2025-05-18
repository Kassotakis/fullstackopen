import { useState, useEffect } from 'react'
import Filter from './Filter'
import PersonForm from './PersonForm'
import Persons from './Persons'
import Notification from './Notification'
import Error from './Error'

import personService from './services/persons'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState('')
  const [error, setError] = useState('')



  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)

  const handleDelete = id => {
  const person = persons.find(p => p.id === id)
  if (window.confirm(`Delete ${person.name}?`)) {
    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== id))
      })
      .catch(() => {
        alert('Failed to delete person')
      })
  }
}


const addPerson = (event) => {
  event.preventDefault()
  const existingPerson = persons.find(person => person.name === newName)
  if (existingPerson) {
    if (window.confirm(`${existingPerson.name} is already in the phonebook. Replace the old number with the new one?`)) {
      const updatedPerson = { ...existingPerson, number: newNumber }
      personService
        .update(existingPerson.id, updatedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(person => 
            person.id !== existingPerson.id ? person : returnedPerson
          ))
          setNotification(
          `${returnedPerson.name}'s phone changes to ${newNumber}`
          )
          setTimeout(() => {
            setNotification(null)
          }, 5000)
          setNewName('')
          setNewNumber('')
        })
        .catch(() => {
          setPersons(persons.filter(person => 
            person.id !== existingPerson.id
          ))
          setError(
          `${existingPerson.name} has been deleted`
          )
          setTimeout(() => {
            setError(null)
          }, 5000)

        })
    }
    return
  }
  const newPerson = { name: newName, number: newNumber }
  personService
    .create(newPerson)
    .then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
      setNewName('')
      setNewNumber('')
      setNotification(
        `${returnedPerson.name} was added to the list`
      )
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    })
    .catch(() => alert('Failed to add person'))
}

  
    const personsToShow = persons.filter(person =>
    person.name && person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />
      <Error message={error} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App
