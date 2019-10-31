const { gql } = require('apollo-server');

const typeDef = gql`
    
    # Read Queries

    type Query {
        user(search: ID, on: UserSearchFlag): [UserType]
        component(search: [ID], on: ComponentSearchFlag): [ComponentType]
        hanzi(search: [ID], on: HanziSearchFlag): [HanziType]
    }

    type Mutation {
        # Create Mutations
        createUser(
            input: CreateUserInput!
        ): CreateUserResponse!
        
        createComponent(
            input: CreateComponentInput!
        ): CreateComponentResponse!

        createHanzi(
            input: CreateHanziInput!
        ): CreateHanziResponse!

        addUserComponents(
            input: AddUserComponentsInput!
        ): AddUserComponentsResponse!

        addUserHanzi(
            input: AddUserHanziInput!
        ): AddUserHanziResponse!

        addHanziComponents(
            input: AddHanziComponentsInput!
        ): AddHanziComponentsResponse!

        # Update Mutations
        
        updateUser(
            input: UpdateUserInput!
        ): UpdateUserResponse!

        updateComponent(
            input: UpdateComponentInput!
        ): UpdateComponentResponse!

        updateHanzi(
            input: UpdateHanziInput!
        ): UpdateHanziResponse!
        
        # Delete Mutations
        
        deleteUser(
            input: DeleteUserInput!
        ): DeleteUserResponse!

        deleteComponent(
            input: DeleteComponentInput!
        ): DeleteComponentResponse!

        deleteHanzi(
            input: DeleteHanziInput!
        ): DeleteHanziResponse!

        removeUserComponents(
            input: RemoveUserComponentsInput!
        ): RemoveUserComponentsResponse!

        removeUserHanzi(
            input: RemoveUserHanziInput!
        ): RemoveUserHanziResponse!

        removeHanziComponents(
            input: RemoveHanziComponentsInput!
        ): RemoveHanziComponentsResponse!
    }
`

module.exports = typeDef;