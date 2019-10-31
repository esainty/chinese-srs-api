const {gql} = require('apollo-server');

const typeDefs = gql`
    # Inputs

    # Create Inputs

    input CreateUserInput {
        username: String!
        firstname: String!
        lastname: String!
        email: String!
        level: Int
        membership: MembershipType
        components: [ID]
        hanzi: [ID]
    }

    input CreateComponentInput {
        name: String!
        level_accessed: Int! 
        component: String!
        meaning: String!
        mnemonic: String!
    }

    input CreateHanziInput {
        level_accessed: Int!
        hanzi: String!
        components: [ID]!
        meaning: String!
        reading: String!
        mnemonic: String!
    }

    input AddUserComponentsInput {
        user_id: ID!
        components: [ID]!
    }

    input AddUserHanziInput {
        user_id: ID!
        hanzi: [ID]!
    }

    input AddHanziComponentsInput {
        hanzi_id: ID!
        components: [ID]!
    }

    # Update Inputs

    input UpdateUserInput {
        id: ID!
        username: String
        firstname: String
        lastname: String
        email: String
        level: Int 
        membership: MembershipType
    }

    input UpdateComponentInput {
        id: ID!
        name: String 
        level_accessed: Int
        component: String
        meaning: String
        mnemonic: String
    }

    input UpdateHanziInput {
        id: ID!
        level_accessed: Int
        hanzi: String
        meaning: String
        reading: String
        mnemonic: String
    }

    # Delete Inputs

    input DeleteUserInput {
        id: ID!
    }

    input DeleteComponentInput {
        id: ID!
    }

    input DeleteHanziInput {
        id: ID!
    }

    input RemoveUserComponentsInput {
        id: ID!
    }

    input RemoveUserHanziInput {
        id: ID!
    }

    input RemoveHanziComponentsInput {
        id: ID!
    }
`;

module.exports = typeDefs;