import './mongoConnector.js'
import { gql, ApolloServer } from 'apollo-server-lambda'
import { Person } from './models/person.js'

const typeDefs = gql`

  type Person {
    name: String!
    country: String!
  }

  type deleteMessage {
    message: String!
    isDeleted: Boolean!
  }

  type Query{
    allPersons: [Person]!
    getPersonsByName(name: String!): [Person]!
  }

  type Mutation{
    addPerson(name: String! country: String!): Person!
    updatePerson(name:String! country: String!): Person!
    deletePerson(name: String!): deleteMessage!
  }

`

const resolvers = {
  Query: {
    allPersons: async (root, args) => {
      try {
        //* Return all the persons in the database
        return await Person.find({})
      } catch (error) {
        console.log(error)
      }
    },
    getPersonsByName: async (root, args) => {
      const { name } = args

      try {
        const person = await Person.find({ name })

        return person
      } catch (error) {
        console.log(error)
      }
    }
  },
  Mutation: {
    addPerson: async (root, args) => {
      const person = new Person({ ...args })
      try {
        await person.save()
        return person
      } catch (error) {
        console.log(error)
        return error
      }
    },
    updatePerson: async (root, args) => {
      const { name, country } = args

      try {
        const person = await Person.findOneAndUpdate({ name }, { country }, {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
          runValidators: true
        })

        return person
      } catch (error) {
        console.log(error)
      }
    },
    deletePerson: async (root, args) => {
      const { name } = args

      try {
        await Person.findOneAndDelete({ name })

        return {
          message: 'Registro eliminado exitosamente',
          isDeleted: true
        }
      } catch (error) {

        return {
          message: 'Error al eliminar el registro',
          isDeleted: false
        }
      }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true
})

//* Create the handler of the server
export const graphqlHandler = server.createHandler()
