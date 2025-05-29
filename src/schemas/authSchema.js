const { gql } = require('apollo-server-express');

const authTypeDefs = gql`
  type User {
  id: ID!
  name: String!
  email: String!
  role: String!
}

input RegisterInput {
  name: String!
  email: String!
  password: String!
  role: String!
}
input UpdateProfileInput {
    name: String
    email: String
    password: String
}

type AuthPayload {
  accessToken: String!
  refreshToken: String!
  user: User!
}

type TokenRefreshPayload {
  accessToken: String!
  refreshToken: String!
}

type Query {
  me: User
}

type Mutation {
  register(input: RegisterInput!): AuthPayload!
  login(email: String!, password: String!): AuthPayload!
  refreshToken(token: String!): TokenRefreshPayload!
  logout(token: String!): Boolean!
  updateProfile(input: UpdateProfileInput!): User!
  resetPassword(oldPassword: String!, newPassword: String!): Boolean!
  }
`;

module.exports = authTypeDefs;
