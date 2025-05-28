const { gql } = require('apollo-server-express');

module.exports = gql`
  type Department {
    id: ID!
    name: String!
  }

  input DepartmentInput {
    name: String!
  }

  type Query {
    departments: [Department!]!
  }

  type Mutation {
    addDepartment(input: DepartmentInput!): Department!
  }
`;
