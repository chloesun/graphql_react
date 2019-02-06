// this is where all the logic related to the express side of our application is going to live
const express = require ('express');
const app = express();
app.listen(4000,()=>{
    console.log('Listening');
});