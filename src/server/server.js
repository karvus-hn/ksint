var express = require('express');
var cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3');

var dbFileName = path.resolve(__dirname, './data/tododb.db')
let db = new sqlite3.Database(dbFileName, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the tododb database.');
});

let queryU= 'SELECT * FROM user WHERE user.username= ? AND user.website = ?'
let queryT= 'SELECT * FROM todo WHERE todo.userId= ? ORDER BY todo.id'

let queryUA= 'SELECT * FROM user'
let queryTA= 'SELECT * FROM todo'

var app = express();
app.use(cors());

// Если запросы без параметров, то результат вся таблица, иначе часть
app.get('/users',function(request,response) {
	var fileName = path.resolve(__dirname,'./data/users.json');
	if ((typeof request.query.username=="undefined") && (typeof request.query.website=="undefined"))
		db.all(queryUA,[],(err, rows)=>{
		  if (err) {
			return console.error(err.message);
		  }
		  response.json(rows)
		})
	else
		db.all(queryU,[request.query.username,request.query.website], (err, row)=>{
		  if (err) {
			return console.error(err.message);
		  }
		  response.json(row)
		})
});

app.get('/todos',function(request,response) {
	var fileName = path.resolve(__dirname,'./data/todos.json');
	if (typeof request.query.userId=="undefined")
		db.all(queryTA,[], (err, rows)=>{
		  if (err) {
			return console.error(err.message);
		  }
		  response.json(rows)
		})
	else
		db.all(queryT,[request.query.userId], (err, rows)=>{
		  if (err) {
			return console.error(err.message);
		  }
		  response.json(rows)
		})
});

app.listen(3001);