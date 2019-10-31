var dbmanager = require('../datasources/db-manager');

// dbmanager.addUser({username: 'sss', firstname: 's', lastname: 'ss', 
// email: 's@s.s', level: 1, membership: 'NONE',
// components: [1, 2, 3], hanzi: [3]});

// dbmanager.addComponent({component: '中', level_accessed: 3, name: 'Zhōng', meaning: 'Middle', 
//     mnemonic: `Line through the middle of a mouth, this means middle.`}).then((result) => console.log(result));

const resolvers = {
    Query: {
        user: (parent, args, context, info) => {
            return dbmanager.getUser(args);
        },
        component: (parent, args, context, info) => {
            return dbmanager.getComponent(args);
        },
        hanzi: (parent, args, context, info) => {
            return dbmanager.getHanzi(args);
        },
    },

    Mutation: {
        // Create
        createUser: (parent, args, context, info) => {
            return dbmanager.addUser(args.input);
        },
        createComponent: (parent, args, context, info) => {
            return dbmanager.addComponent(args.input);
        },
        createHanzi: (parent, args, context, info) => {
            return dbmanager.addHanzi(args.input);
        },
        addUserComponents: (parent, args, context, info) => {
            return dbmanager.addUserComponents(args.input);
        },
        addUserHanzi: (parent, args, context, info) => {
            return dbmanager.addUserHanzi(args.input);
        },
        addHanziComponents: (parent, args, context, info) => {
            return dbmanager.addHanziComponents(args.input);
        },

        // Update
        updateUser: (parent, args, context, info) => {
            return dbmanager.updateUser(args.input);
        },
        updateComponent: (parent, args, context, info) => {
            return dbmanager.updateComponent(args.input);
        },
        updateHanzi: (parent, args, context, info) => {
            return dbmanager.updateHanzi(args.input);
        },

        // Delete
        deleteUser: (parent, args, context, info) => {
            return dbmanager.deleteUser(args.input);
        },
        deleteComponent: (parent, args, context, info) => {
            return dbmanager.deleteComponent(args.input);
        },
        deleteHanzi: (parent, args, context, info) => {
            return dbmanager.deleteHanzi(args.input);
        },
        removeUserComponents: (parent, args, context, info) => {
            return dbmanager.deleteUserComponents(args.input);
        },
        removeUserHanzi: (parent, args, context, info) => {
            return dbmanager.deleteUserHanzi(args.input);
        },
        removeHanziComponents: (parent, args, context, info) => {
            return dbmanager.deleteHanziComponent(args.input);
        },
    },

    UserType: {
        learned_components: (parent, args, context, info) => {
            return dbmanager.getUserComponents({id: parent.id});
        },
        learned_hanzi: (parent, args, context, info) => {
            return dbmanager.getUserHanzi({id: parent.id});
        }
    },

    HanziType: {
        components: (parent, args, context, info) => {
            return dbmanager.getHanziComponents({id: parent.id});
        }
    }
}

module.exports = resolvers;