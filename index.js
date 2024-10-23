// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require('dotenv')
// const app = express();

// app.use(express.json());

// const port = 8000;
// app.listen(port, () => {
//     console.log("Server is listening on port ", port);
// })

const UserModel = require("./src/app/api/graphql/model/User.model");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
mongoose.connect("mongodb+srv://sudheer:123@cluster0.w4sot.mongodb.net/user")
    .then(() => {
        console.log("Database Connected Successfully");
    }).catch((error) => {
        console.log("Failed to connect db");
})

app.use(express.json());

const user = UserModel.create({
    username: "Praveen",
    email:  "vuddagir@ggmail.com",
    password: "123"
})

console.log(user);

const port = 8000;
app.listen(port, () => {
    console.log("Server is listening on port ", port);
})