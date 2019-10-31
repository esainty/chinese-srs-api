const dataTypes = require('./types/data-types');
const inputTypes = require('./types/input-types');
const payloadTypes = require('./types/payload-types');
const enumTypes = require('./types/enum-types');
const queries = require('./queries');

const typeDefs = [dataTypes, inputTypes, payloadTypes, enumTypes, queries];

module.exports = typeDefs;