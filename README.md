# chinese-srs-api
Node.js API for a Chinese language Spaced Repetition System.

Prototype 1.0

API enables CRUD operations to be performed via GraphQL functions for the following basic data types:

```graphql
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
```

For a complete API reference, see graphql/types/* or check out the GraphQL playground over at http://3.24.134.100:4000/
