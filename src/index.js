'use strict'
import './styles/main.styl'

function Persona (name, yearOfBirth, genre, profession, couple) {
  this.name = name
  this.age = new Date().getFullYear() - yearOfBirth
  this.genre = genre
  this.profession = profession
  this.inRelationship = () => !!this.couple
  this.couple = couple || null
  this.greet = () => {
    return `Hey I'm ${this.name}, I'm ${this.age} and ${this.myProfession()}`
  }
  this.myProfession = () => {
    return `I'm ${this.profession ? this.profession : 'unemployed'}`
  }
  this.introduceCouple = () => {
    const coupleGenre = this.couple?.genre
    const endings = {
      male: {
        pronoun: 'his',
        noun: 'boyfriend'
      },
      female: {
        pronoun: 'her',
        noun: 'girlfriend'
      }
    }
    return this.inRelationship() ? `Meet you my ${endings[coupleGenre].noun}, ${endings[coupleGenre].pronoun} name is ${this.couple.name}` : 'I\'m single'
  }
}

const jorge = new Persona('Jorge', 1994, 'male', 'Web UI Developer')
const daniela = new Persona('Daniela', 1994, 'female', 'Interior Designer')
const laura = new Persona('Laura', 2005, 'female', 'Make Up Artist')
jorge.couple = daniela
daniela.couple = jorge

const people = [jorge, daniela, laura]
const timer = setInterval(showPerson, 1000)
let personTurn = 0

function showPerson () {
  const person = people[personTurn]
  document.getElementsByTagName('h1')[0].textContent = person?.greet() || 'Hey'
  document.getElementById('userName').textContent = person?.name || 'NO Information'
  document.getElementById('userWork').textContent = person?.profession || 'NO Information'
  document.getElementById('userRelation').textContent = person?.introduceCouple() || 'NO Information'
  personTurn++
  if (personTurn > people.length) clearInterval(timer)
}
