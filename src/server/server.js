var express = require('express');
var cors = require('cors');
const path = require('path');

var app = express();
app.use(cors());

app.get('/users',function(request,response) {
	var fileName = path.resolve(__dirname,'./data/users.json');
	response.sendFile(fileName,{})
});

app.get('/todos',function(request,response) {
	var fileName = path.resolve(__dirname,'./data/todos.json');
	response.sendFile(fileName,{})
});

app.listen(3001);