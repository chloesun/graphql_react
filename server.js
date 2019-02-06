// this is where all the logic related to the express side of our application is going to live
const express = require ('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema');

const app = express();

// so any routes come with /graphql will be handled by graphql
//app.use is how we wire up middleware to an express application, middleware are tiny functions meant to intercept
//or modify requests as they come through express server
//expressGraphQl is registered as a middleware
app.use('/graphql', expressGraphQL({
    //schema: schema,
    schema,
    graphiql:true
}));

//listening on port 4000
app.listen(4000,()=>{
    console.log('Listening');
});