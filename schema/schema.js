const graphql = require('graphql');
const _ = require('lodash');
const axios = require ('axios');
//graphqlschema takes a root query and returns a graphql schema instance
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList
} = graphql;

//hard coded users
// const users = [
//     { id: '23', firstName: 'Bill' , age: 20},
//     { id: '47', firstName: 'Sam' , age: 21}
// ];

//define companytype, have to put it before the usertype, add arrow function to resolve cirrcular references because of closure
const CompanyType = new GraphQLObjectType({
    name:'Company',
    fields:()=> (
        {
            id:{type: GraphQLString},
            name:{type: GraphQLString},
            description:{type:GraphQLString},
            users:{
                type:new GraphQLList(UserType),
                resolve(parentValue, args){
                    return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                    .then(resp => resp.data);
                }
            }
        }
    ) 
});

// define user data type
const UserType = new GraphQLObjectType({
    name: 'User',
    fields:()=>(
        {
            id:{type: GraphQLString},
            firstName:{type: GraphQLString},
            age:{type:GraphQLInt},
            company:{
                type:CompanyType,
                resolve(parentValue, args){
                    return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                    .then(resp => resp.data);
                }
            }
        }

    ) 
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
                // make the http request , before anything happens with the promise, take the response return only response.data 
                // because promise, we can fetch data from anywhere, can be a third-party server, could be reading a file off the hard drive
                // it can be a database ...etc
                return axios.get(`http://localhost:3000/users/${args.id}`)
                .then(resp => resp.data);
            }
        },
        company: {
            type: CompanyType,
            args:{id:{type:GraphQLString}},
            resolve(parentValue, args){
                // make the http request , before anything happens with the promise, take the response return only response.data 
                // because promise, we can fetch data from anywhere, can be a third-party server, could be reading a file off the hard drive
                // it can be a database ...etc
                return axios.get(`http://localhost:3000/companies/${args.id}`)
                .then(resp => resp.data); //to make it compatible between axios and graphql, a workaround
            }
        }
    }
});

//expose this to the rest of the application
module.exports = new GraphQLSchema({
    query: RootQuery
});