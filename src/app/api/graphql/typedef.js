const { gql } = require('apollo-server-express');

const typeDefs = gql`

  # Mutations for sign up, login, and adding a book
  type Mutation {
    signUp(signUpData: signUpInput): signUpResponse
    login(email: String!, password: String!): LoginResponse
  }

  # Response types for login and sign up
  type LoginResponse {
    msg: String
    token: String
    user: String
    role: String
    userName: String
  }

  type signUpResponse {
    id: String
    msg: String
    role: String
    code:String
  }

  # Input types for signup and book creation
  input signUpInput {
    userName: String!
    email: String!
    password: String!
    role: UserRoleEnumType!  # Use UserRoleEnumType or roleType consistently
    code:String
  
  }

`;

module.exports = typeDefs;