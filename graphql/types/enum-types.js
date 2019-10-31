const {gql} = require('apollo-server');

const typeDefs = gql`
    enum MembershipType {
        NONE
        MEMBER
        ADMIN
    }

    enum LearningItemType {
        COMPONENT
        HANZI
        VOCABULARY
    }

    enum UserSearchFlag {
        ID
        USERNAME
        EMAIL
    }

    enum ComponentSearchFlag {
        ID
        LEVEL
        COMPONENT
        MEANING
    }

    enum HanziSearchFlag {
        ID
        LEVEL
        HANZI
        MEANING
        READING
    }

    enum WordSearchFlag {
        ID
        LEVEL
        WORD
        MEANING
        READING
    }
`;

module.exports = typeDefs;