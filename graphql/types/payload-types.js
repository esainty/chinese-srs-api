const {gql} = require('apollo-server');

const typeDefs = gql`
    # Mutation Payloads

    # Create Mutation Payloads

    type CreateUserResponse {
        success: Boolean!
        message: String
        user: UserType
    }

    type CreateComponentResponse {
        success: Boolean!
        message: String
        component: ComponentType
    }

    type CreateHanziResponse {
        success: Boolean!
        message: String
        hanzi: HanziType
    }

    type AddUserComponentsResponse {
        success: Boolean!
        message: String
        components: [ComponentType]
    }

    type AddUserHanziResponse {
        success: Boolean!
        message: String
        hanzi: [HanziType]
    }

    type AddHanziComponentsResponse {
        success: Boolean!
        message: String
        components: [ComponentType]
    }

    # Update Mutation Paylods

    type UpdateUserResponse {
        success: Boolean!
        message: String
        user: UserType
    }

    type UpdateComponentResponse {
        success: Boolean!
        message: String
        component: ComponentType
    }

    type UpdateHanziResponse {
        success: Boolean!
        message: String
        hanzi: HanziType
    }

    # Delete Mutation Payloads
    # Mutations should return the deleted entity if successful

    type DeleteUserResponse {
        success: Boolean!
        message: String
        user: UserType
    }

    type DeleteComponentResponse {
        success: Boolean!
        message: String
        component: ComponentType
    }

    type DeleteHanziResponse {
        success: Boolean!
        message: String
        hanzi: HanziType
    }

    type RemoveUserComponentsResponse {
        success: Boolean!
        message: String
        components: [ComponentType]
    }

    type RemoveUserHanziResponse {
        success: Boolean!
        message: String
        hanzi: [HanziType]
    }

    type RemoveHanziComponentsResponse {
        success: Boolean!
        message: String
        components: [ComponentType]
    }
`;

module.exports = typeDefs;