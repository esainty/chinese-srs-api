const { gql } = require('apollo-server');

const typeDef = gql`
    type UserType {
        id: ID!
        username: String!
        firstname: String!
        lastname: String!
        email: String!
        level: Int!
        membership: MembershipType!
        learned_components: [ComponentType]
        learned_hanzi: [HanziType]
    }

    type ComponentType {
        id: ID! 
        level_accessed: Int! 
        component: String!
        name: String!
        meaning: String!
        mnemonic: String!
    }

    type HanziType {
        id: ID! 
        level_accessed: Int!
        hanzi: String!
        components: [ComponentType]!
        meaning: String!
        reading: String!
        mnemonic: String!
    }
`

module.exports = typeDef;