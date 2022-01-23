const express = require("express");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const pinRoute = require('./routes/pins')
const userRoute = require('./routes/users')
const cors = require('cors');

const app = express();
app.use(express.json());
dotenv.config();

app.use(cors());

mongoose
	.connect(process.env.MONGO_URL)
	.then(() => {
		console.log("MongoDB Connected!!");
	})
	.catch((e) => {
		console.log(e);
	});

	app.use('/api/pins', pinRoute);
	app.use('/api/users', userRoute);
	
app.listen("8800", () => {
	console.log("server is running");
});


