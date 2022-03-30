const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type TestData {
        text: String!
        views: Int!
    }

    type RootQuery {
        hello: TestData!
    }

    type userInputData {
        name: String!
        email: String!
        password: String!
    }

    type userData {
        _id: ID!
        name: String!
        email: String!
    }

    type RootMutation {
        createUser(userInput: userInputData): userData!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`)