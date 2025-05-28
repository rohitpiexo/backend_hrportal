const { gql } = require('apollo-server-express');

const authTypeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
    role: String!
  }

  type Query {
    me: User
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload
    login(email: String!, password: String!): AuthPayload
  }
`;

module.exports = authTypeDefs;
