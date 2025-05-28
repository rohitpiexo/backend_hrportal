const { gql } = require('apollo-server-express');

const employeeTypeDefs = gql`
  type Employee {
    id: ID!
    name: String!
    email: String!
    role: String!
    department: Department 
  }

  input EmployeeInput {
    name: String!
    email: String!
    department: String
    role: String!
    departmentId: Int!
  }

  type Query {
    employees: [Employee!]!
    employee(id: ID!): Employee
  }

  type Mutation {
    addEmployee(input: EmployeeInput!): Employee!
    updateEmployee(id: ID!, input: EmployeeInput!): Employee!
    deleteEmployee(id: ID!): Boolean!
  }
`;

module.exports = employeeTypeDefs;
