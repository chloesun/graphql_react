const graphql = require('graphql');
const _ = require('lodash');
//graphqlschema takes a root query and returns a graphql schema instance
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema
} = graphql;

//hard coded users
const users = [
    { id: '23', firstName: 'Bill' , age: 20},
    { id: '47', firstName: 'Sam' , age: 21}
];


// define user data type
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id:{type: GraphQLString},
        firstName:{type: GraphQLString},
        age:{type:GraphQLInt}
    }
}); 

// the entry point of data graph
// you can ask me in the root query about users in the application
// if you give me the id of the user you are looking for, i will return a user back to you
// resolve function is we go into the database and we fetch/return the actual data that we are looking for
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields:{
        user: {
            type: UserType,
            args:{id:{type:GraphQLString}},
            resolve(parentValue, args){
                // lodash go through all the users and return the first user who has the id equal to args.id
                return _.find(users, {id: args.id})
            }
        }

    }
});

//expose this to the rest of the application
module.exports = new GraphQLSchema({
    query: RootQuery
});