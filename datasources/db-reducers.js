const reducers = {
    userReducer: ({users, components, hanzi}) => {
        console.log(users);
        return users.map((user) => {
            return {
                id: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                level: user.level,
                membership: user.membership
            }
        });
    },

    reduceHanzi: (results) => {
        var outputHanzi = [];
        results.map((result) => {
            var foundIndex = null;
            if (outputHanzi.some((hanzi, index) => {
                foundIndex = index;
                return hanzi.id === result.Hanzi.id;
            })) {
                outputHanzi[foundIndex].components.push(result.Component);
            } else {
                outputHanzi.push({...result.Hanzi, components: [result.Component]});
            }
        })
        return outputHanzi;
    }
};

module.exports = reducers;