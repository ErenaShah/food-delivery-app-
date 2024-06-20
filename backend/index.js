const express = require('express');
const app = express();
const port = 5000;
const mongoDB = require("./db");
app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
})
// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoDB();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Use the CreateUser route
app.use('/api', require('./Routes/CreateUser'));
app.use('/api', require('./Routes/DisplayData'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
