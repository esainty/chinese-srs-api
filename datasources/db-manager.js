var mysql = require('mysql');
const dbreducer = require('./db-reducers');

class dbManager {
    constructor() {
        this.pool = mysql.createPool({
            host: 'db-chinese-srs.ccsvil2uqp0x.ap-southeast-2.rds.amazonaws.com',
            user: 'admin_es',
            password: 'defaultpassword',
            database: 'ChineseSRSDB',
        });
    }

    // Create

    addUser({username, firstname, lastname, email, level, membership, components = [], hanzi = []}) {
        return new Promise(
            (resolve, reject) => {
                const options = {sql:`
                    INSERT INTO User 
                        (username, firstname, lastname, email, level, membership)
                    VALUES 
                        ('${username}', '${firstname}', '${lastname}', 
                        '${email}', '${level}', '${membership}');
                `};
                this.pool.query(options, (err, results, fields) => {
                    if (err) {
                        reject(err);
                    } else {
                        // Use ID for new user to add components and hanzi to relevant tables
                        // Retrieves values from returned promises as a new user should only have the inserted values
                        const componentPromise = this.addUserComponents({id: results.insertId, components: components});
                        const hanziPromise = this.addUserHanzi({id: results.insertId, hanzi: hanzi});
                        const userPromise = this.getUser({search: [results.insertId], on: 'ID'});

                        Promise.all([userPromise, componentPromise, hanziPromise]).then((resolutions) => {
                            const newuser = resolutions[0];
                            console.log(newuser);
                            const usercomponents = resolutions[1];
                            const userhanzi = resolutions[2];
                            const message = `User successfully created with 
                                ${usercomponents.length} components & 
                                ${userhanzi.length} hanzi`;
                            const success = true;
                            var output = {success: success, message: message, 
                                user: {...newuser[0], learned_components: usercomponents, learned_hanzi: userhanzi}};
                            console.dir(output, {depth: null});
                            resolve(output);
                        }).catch((error) => {
                            // Extremely sophisticated error handling
                            reject(error);
                        })
                    }
                });
            }
        )
    }

    addUserComponents({user_id, components = []}) {
        return new Promise(
            (resolve, reject) => {
                // For each component in the array, add to insertion SQL query
                if (components.length > 0) {
                    var query = `
                        INSERT INTO UserComponent (id_user, id_component)
                        VALUES
                    `;
                    for (const component of components) {
                        query += ` (${user_id}, ${component}),`;
                    }
                    // Remove the leftover comma from the end of the query
                    query = query.substring(0, query.length - 1);
                    this.pool.query(query, (err, results, fields) => {
                        if (err) {
                            reject(err);
                        } else {
                            // Get all of the user's components
                            const promise = this.getUserComponents({id: user_id});
                            // Return the components
                            promise.then((result) => {
                                resolve({success: true, components: result});
                            }).catch((error) => {
                                reject(error);
                            });
                        }
                    });
                } else {
                    resolve([]);
                }
            }
        );
    }

    addUserHanzi({user_id, hanzi = []}) {
        return new Promise(
            (resolve, reject) => {
                if (hanzi.length > 0) {
                    // For each hanzi in the array, add to the insertion query
                    var query = `
                    INSERT INTO UserHanzi 
                        (id_user, id_hanzi)
                    VALUES 
                    `;
                    for (const character of hanzi) {
                        query += ` (${user_id}, ${character}),`;
                    }
                    // Remove the leftover comma from the end of the query
                    query = query.substring(0, query.length - 1);
                    this.pool.query(query, (err, results, fields) => {
                        if (err) {
                            reject(err);
                        } else {
                            // Get the newly inserted components
                            const promise = this.getHanzi({search: hanzi, on: 'ID'});
                            // Return the newly inserted components
                            promise.then((result) => {
                                resolve({sucess: true, hanzi: result});
                            }).catch((error) => {
                                reject(error);
                            });
                        }
                    });
                } else {
                    resolve([]);
                }
            }
        );
    }

    addComponent({component, level_accessed, name, meaning, mnemonic}) {
        return new Promise(
            (resolve, reject) => {
                const query = `
                    INSERT INTO Component (component, level_accessed, name, meaning, mnemonic)
                    VALUES ('${component}', ${level_accessed}, '${name}', '${meaning}', '${mnemonic}');
                `;
                this.pool.query(query, (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        // Retrieve inserted component using results.insertId
                        const componentPromise = this.getComponent({search: [results.insertId], on: 'ID'});
                        // Return result of component retrieval promise.
                        componentPromise.then((result) => {
                            const success = true;
                            const message = `Component added successfully`;
                            resolve({success: success, message: message, component: result[0]});
                        }).catch((error) => {
                            reject(error);
                        });
                    }
                });
            }
        );
    }

    addHanzi({hanzi, level_accessed, meaning, reading, mnemonic, components = []}) {
        return new Promise(
            (resolve, reject) => {
                const query = `
                    INSERT INTO Hanzi (hanzi, level_accessed, meaning, reading, mnemonic)
                    VALUES ('${hanzi}', ${level_accessed}, '${meaning}', '${reading}', '${mnemonic}');
                `;
                this.pool.query(query, (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        // Retrieve inserted hanzi and add components using id of inserted hanzi
                        const hanziPromise = this.getHanzi({search: [results.insertId], on: 'ID'});
                        const componentPromise = this.addHanziComponents({id: results.insertId, components: components});
                        // Return result of component retrieval promise.
                        Promise.all([hanziPromise, componentPromise]).then((resolutions) => {
                            const newhanzi = resolutions[0];
                            const hanzicomponents = resolutions[1];
                            const success = true; 
                            const message = 'Hanzi added successfully';
                            resolve({success: success, message: message, 
                                hanzi: {...newhanzi[0], components: hanzicomponents}});
                        }).catch((error) => {
                            reject(error);
                        });
                    }
                });
            }
        );
    }

    addHanziComponents({hanzi_id, components = []}) {
        return new Promise(
            (resolve, reject) => {
                // For each component or hanzi supplied, add to insertion SQL query.
                if (components.length > 0) {
                    var query = `
                    INSERT INTO HanziComponent 
                        (id_hanzi, id_component)
                    VALUES 
                    `;
                    for (const component of components) {
                        query += ` (${hanzi_id}, ${component}),`;
                    }
                    // Remove the leftover comma from the end of the query
                    query = query.substring(0, query.length - 1);
                    this.pool.query(query, (err, results, fields) => {
                        if (err) {
                            reject(err);
                        } else {
                            // Get the newly inserted components
                            const promise = this.getComponent({search: components, on: 'ID'});
                            // Return the newly inserted components
                            promise.then((result) => {
                                resolve({success: true, components: result});
                            }).catch((error) => {
                                reject(error);
                            });
                        }
                    });
                }
            }
        );
    }


    // Read 

    getUser({search = false, on = 'ID'}) {
        return new Promise(
            (resolve, reject) => {
                var query = `
                    SELECT User.*
                    FROM User
                `;
                if (search) {
                    switch(on) {
                        case 'ID':
                            query += `WHERE User.id = ${search}`;
                            break;
                        case 'USERNAME':
                            query += `WHERE User.username = '${search}'`;
                            break;
                        case 'EMAIL':
                            query += `WHERE User.email = '${search}'`;
                            break;
                    }
                }
                this.pool.query(query, (err, results, fields) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (results.length > 0) {
                            resolve(results);
                        } else {
                            reject(new Error('ID provided did not return any user'));
                        }
                    }
                });
            }    
        );
    }

    getComponent({search = [], on = 'ID'}) {
        return new Promise(
            (resolve, reject) => {
                var query =`
                    SELECT Component.*
                    FROM Component
                `;
                if (search.length > 0) {
                    switch(on) {
                        case 'ID':
                            query += `WHERE Component.id IN (${search})`;
                            break;
                        case 'LEVEL':
                            query += `WHERE Component.level_accessed IN (${search})`;
                            break;
                        case 'COMPONENT':
                            // Surround each search term in quotation marks
                            // E.g. hanzi IN ("一", "二") rather than hanzi IN (一, 二)
                            query += `WHERE Component.component IN (${search.map((element => {return `'${element}'`}))})`;
                            break;
                        case 'MEANING':
                            // Build regular expression for comparison
                            var regex = ``;
                            for (const meaning of search) {
                                regex += `.?${meaning}.?|`
                            }
                            // Remove trailing divider |
                            regex = regex.substring(0, regex.length - 1);
                            query += `WHERE Component.meaning REGEXP '${regex}'`;
                            break;
                    }
                }
                this.pool.query(query, (err, results, fields) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            }    
        );
    }

    getUserComponents({id}) {
        return new Promise(
            (resolve, reject) => {
                const options = {sql: `
                    SELECT Component.* 
                    FROM User
                    INNER JOIN UserComponent
                    ON User.id = UserComponent.id_user
                    INNER JOIN Component
                    ON UserComponent.id_component = Component.id
                    WHERE User.id = ${id}
                `};
                this.pool.query(options, (err, results, fields) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                })
            }
        )
    }

    getHanziComponents({id}) {
        return new Promise(
            (resolve, reject) => {
                const options = {sql: `
                    SELECT Component.* 
                    FROM Hanzi
                    INNER JOIN HanziComponent
                    ON Hanzi.id = HanziComponent.id_hanzi
                    INNER JOIN Component
                    ON HanziComponent.id_component = Component.id
                    WHERE Hanzi.id = ${id}
                `};
                this.pool.query(options, (err, results, fields) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (results.length > 0) {
                            resolve(results);
                        } else {
                            reject(new Error('Hanzi does not have any associated components'));
                        }
                    }
                })
            }
        )
    }

    getHanzi({search = [], on = 'ID'}) {
        return new Promise(
            (resolve, reject) => {
                var query =`
                    SELECT Hanzi.* 
                    FROM Hanzi
                `;
                if (search != false) {
                    switch(on) {
                        case 'ID':
                            query += `WHERE Hanzi.id IN (${search})`;
                            break;
                        case 'LEVEL':
                            query += `WHERE Hanzi.level_accessed IN (${search})`;
                            break;
                        case 'HANZI':
                            // Surround each search term in quotation marks
                            // E.g. hanzi IN ("一", "二") rather than hanzi IN (一, 二)
                            query += `WHERE Hanzi.hanzi IN (${search.map((element => {return `'${element}'`}))})`;
                            break;
                        case 'MEANING':
                            // Build regular expression for comparison
                            var regex = ``;
                            for (const meaning of search) {
                                regex += `.?${meaning}.?|`
                            }
                            // Remove trailing divider |
                            regex = regex.substring(0, regex.length - 1);
                            query += `WHERE Hanzi.meaning REGEXP '${regex}'`;
                            break;
                        case 'READING':
                            // Build regular expression for comparison
                            var regex = ``;
                            for (const reading of search) {
                                regex += `.?${reading}.?|`
                            }
                            // Remove trailing divider |
                            regex = regex.substring(0, regex.length - 1);
                            query += `WHERE Hanzi.reading REGEXP '${regex}'`;
                            break;
                    }
                }
                this.pool.query(query, (err, results, fields) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                })
            }  
        );
    }

    getUserHanzi({id}) {
        return new Promise(
            (resolve, reject) => {
                const options = {sql: `
                    SELECT Hanzi.* 
                    FROM User
                    INNER JOIN UserHanzi
                    ON User.id = UserHanzi.id_user
                    INNER JOIN Hanzi
                    ON UserHanzi.id_hanzi = Hanzi.id
                    WHERE User.id = ${id}
                `};
                this.pool.query(options, (err, results, fields) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                })
            }
        )
    }

    // Update 


    updateUser({id, username = null, firstname = null, lastname = null, email = null, 
        level = null, membership = null}) {
        return new Promise(
            (resolve, reject) => {
                // Handle single table updates
                if (username || firstname || lastname || email || level || membership) {
                    var query = `
                        UPDATE User
                        SET`;
                    // Add update statements where relevant
                    if (username) {
                        query += ` username = "${username}",`;
                    } 
                    if (firstname) {
                        query += ` firstname = "${firstname}",`;
                    } 
                    if (lastname) {
                        query += ` lastname = "${lastname}",`;
                    }
                    if (email) {
                        query += ` email = "${email}",`;
                    }
                    if (level) {
                        query += ` level = ${level},`;
                    }
                    if (membership) {
                        query += ` membership = "${membership}",`;
                    }
                    // Remove comma from end
                    query = query.substring(0, query.length - 1);
                    query += ` WHERE id = ${id}`;
                    this.pool.query(query, (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            this.getUser({search: id, on: 'ID'}).then((resolution) => {
                                resolve({success: true, user: resolution[0]});
                            }).catch((error => {
                                reject(error);
                            }))
                        }
                    })
                } else {
                    reject("No valid parameters passed to update");
                }
            }
        );
    }

    updateComponent({id, level_accessed = null, component = null, name = null, meaning = null, mnemonic = null}) {
        return new Promise(
            (resolve, reject) => {
                // Handle single table updates
                if (component || level_accessed || name || meaning || mnemonic) {
                    var query = `
                        UPDATE Component
                        SET`;
                    // Add update statements where relevant
                    if (component) {
                        query += ` component = "${component}",`;
                    }
                    if (level_accessed) {
                        query += ` level_accessed = ${level_accessed},`;
                    }  
                    if (name) {
                        query += ` name = "${name}",`;
                    } 
                    if (meaning) {
                        query += ` meaning = "${meaning}",`;
                    }
                    if (mnemonic) {
                        query += ` mnemonic = "${mnemonic}",`;
                    }
                    // Remove comma from end
                    query = query.substring(0, query.length - 1);
                    query += ` WHERE id = ${id}`;
                    this.pool.query(query, (err, result) => {
                        if (err) {
                            reject (err);
                        } else {
                            this.getComponent({search: [id], on: 'ID'}).then((resolution) => {
                                resolve({success: true, component: resolution[0]});
                            }).catch((error) => {
                                reject(error);
                            });
                        }
                    })
                } else {
                    reject ("No valid parameters passed to update");
                }
            }
        );
    }

    updateHanzi({id, hanzi = null, level_accessed = null, meaning = null, reading = null, mnemonic = null}) {
        return new Promise(
            (resolve, reject) => {
                // Handle single table updates
                if (hanzi || level_accessed || meaning || reading || mnemonic) {
                    var query = `
                        UPDATE Hanzi
                        SET`;
                    // Add update statements where relevant
                    if (hanzi) {
                        query += ` hanzi = "${hanzi}",`;
                    } 
                    if (level_accessed) {
                        query += ` level_accessed = ${level_accessed},`;
                    } 
                    if (meaning) {
                        query += ` meaning = "${meaning}",`;
                    } 
                    if (reading) {
                        query += ` reading = "${reading}",`;
                    }
                    if (mnemonic) {
                        query += ` mnemonic = "${mnemonic}",`;
                    }
                    // Remove comma from end
                    query = query.substring(0, query.length - 1);
                    query += ` WHERE id = ${id}`;
                    this.pool.query(query, (err, result) => {
                        if (err) {
                            reject (err);
                        } else {
                            this.getHanzi({search: [id], on: 'ID'}).then((resolution) => {
                                resolve({success: true, hanzi: resolution[0]});
                            }).catch((error) => {
                                reject(error);
                            });
                        }
                    })
                } else {
                    reject ("No valid parameters passed to update");
                }
            }
        );
    }

    // Delete

    deleteUser({id}) {
        return new Promise(
            (resolve, reject) => {
                // Grab user before it's destroyed. 
                this.getUser({search: id, on: 'ID'}).then((user) => {
                    // Clear Foreign-Key dependencies
                    // Perform clears in parallel before clearing User. 
                    const userComponentPromise = new Promise((subresolve, subreject) => {
                        var query = `
                            DELETE From UserComponent
                            WHERE id_user = ${id};
                        `;
                        this.pool.query(query, (err, results) => {
                            if (err) {
                                subreject(err);
                            } else {
                                subresolve({success: true});
                            }
                        });
                    });
                    const userHanziPromise = new Promise((subresolve, subreject) => {
                        var query = `
                            DELETE From UserHanzi
                            WHERE id_User = ${id};
                        `
                        this.pool.query(query, (err, results) => {
                            if (err) {
                                subreject(err);
                            } else {
                                subresolve({success: true});
                            }
                        });
                    });
                    Promise.all([userComponentPromise, userHanziPromise]).then((resolutions) => {
                        // Check to make sure both deletes were successful. 
                        if (resolutions[0].success && resolutions[1].success) {
                            // Delete the user
                            var query = `
                                DELETE FROM User
                                WHERE id = ${id};
                            `;
                            this.pool.query(query, (err, results) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    const success = true;
                                    const message = "User and all dependents deleted.";
                                    // Return the user object as it was prior to deletion. 
                                    resolve({success, message, user: user[0]});
                                }
                            });
                        }
                    });
                }).catch((error) => {
                    reject(error);
                });
            }
        );
    }

    deleteUserComponents({id, components = []}) {
        return new Promise(
            (resolve, reject) => {
                if (components.length > 0) {
                    // Build SQL query
                    query += `
                        DELETE FROM UserComponent
                        WHERE id_user = ${id} AND id_component IN (${components});
                    `;
                    this.pool.query(query, (err, results) => {
                        if (err) reject(err);
                        this.getUserComponents({search: id, on: 'ID'}).then((result) => {
                            resolve(result);
                        }).catch((error) => {
                            reject(error);
                        });
                    });
                } else {
                    reject({success: false, message: "No valid components passed to delete"});
                }
            }
        );
    }

    deleteUserHanzi({id, hanzi = []}) {
        return new Promise(
            (resolve, reject) => {
                if (hanzi.length > 0) {
                    // Build SQL query
                    query += `
                        DELETE FROM UserHanzi
                        WHERE id_user = ${id} AND id_hanzi IN (${hanzi});
                    `;
                    this.pool.query(query, (err, results) => {
                        if (err) reject(err);
                        const hanziPromise = this.getUserHanzi({search: id, on: 'ID'});
                        hanziPromise.then((result) => {
                            resolve(result);
                        }).catch((error) => {
                            reject(error);
                        });
                    });
                } else {
                    reject({success: false, message: "No valid hanzi passed to delete"});
                }
            }
        );
    }

    deleteComponent({id}) {
        return new Promise(
            (resolve, reject) => {
                // Get component before it's removed. 
                this.getComponent({search: [id], on: 'ID'}).then((component) => {
                    // Remove component
                    var query = `
                        DELETE FROM Component
                        WHERE id = ${id};
                    `;
                    this.pool.query(query, (err, results) => {
                        if (err) {
                            reject(err);
                        } else {
                            const success = true;
                            const message = "Component deleted";
                            resolve({success, message, component: component[0]});
                        }
                    });
                }).catch((error) => {
                    reject(error);
                });
            }
        );
    }

    deleteHanzi({id}) {
        return new Promise(
            (resolve, reject) => {
                this.getHanzi({search: [id], on: 'ID'}).then((hanzi) => {
                    // Semisynchronously delete foreign key dependencies
                    new Promise(
                        (subresolve, subreject) => {
                            var query = `
                                DELETE FROM HanziComponent
                                WHERE id_hanzi = ${id};
                            `;
                            this.pool.query(query, (err, results) => {
                                if (err) {
                                    subreject(err);
                                } else {
                                    subresolve({success: true});
                                }
                            });
                        }
                    // Then delete Hanzi
                    ).then((resolution) => {
                        var query = `
                            DELETE FROM Hanzi
                            WHERE id = ${id};
                        `;
                        this.pool.query(query, (err, results) => {
                            if (err) {
                                reject(err);
                            } else {
                                const success = true;
                                const message = "Hanzi and all dependants deleted"
                                resolve({success, message, hanzi: hanzi[0]});
                            }
                        })
                    }).catch((error) => {
                        reject(error);
                    });
                });
            }
        );
    }

    deleteHanziComponent({id, components = []}) {
        return new Promise(
            (resolve, reject) => {
                if (components.length > 0) {
                    // Build SQL query
                    query += `
                        DELETE FROM HanziComponent
                        WHERE id_hanzi = ${id} AND id_component IN (${components});
                    `;
                    this.pool.query(query, (err, results) => {
                        if (err) reject(err);
                        this.getHanziComponents({search: id, on: 'ID'}).then((result) => {
                            resolve(result);
                        }).catch((error) => {
                            reject(error);
                        });
                    });
                } else {
                    reject({success: false, message: "No valid components passed to delete"});
                }
            }
        );
    }
}


module.exports = new dbManager();