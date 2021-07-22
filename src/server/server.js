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

let queryU = 'SELECT * FROM user WHERE user.username= ? AND user.website = ?'
let queryT = 'SELECT * FROM todo WHERE todo.userId= ? ORDER BY todo.id'

let queryUAll = 'SELECT * FROM user'
let queryTAll = 'SELECT * FROM todo'

let queryTInsert = 'INSERT INTO todo VALUES ((SELECT max(todo.id) from todo)+1,(?),(?),0)';
let queryTDelete = 'DELETE FROM todo WHERE todo.id= ? ';

let queryTUpdate1 = 'UPDATE todo SET completed=NOT completed WHERE todo.id= ?';
let queryTUpdate2 = 'UPDATE todo SET completed=(?), title = (?) WHERE todo.id= (?)';

var app = express();
app.use(cors());

const jsonParser = express.json();

// Если GET-запросы без параметров, то результат вся таблица, иначе часть
app.get('/users',function(request,response) {
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
	var sQuery = '';
	
	if (typeof request.query.userId=="undefined")
		sQuery = queryTAll;
	else
		sQuery = queryT;
	
	db.all(sQuery,[request.query.userId], (err, rows)=>{
	  if (err) {
		return console.error(err.message);
	  }
	  response.json(rows)
	})
});

// Создание todo
app.post('/todos',jsonParser,function(request,response) {
	let todo = request.body;
	db.run(queryTInsert, [todo["userId"],todo["title"]], function(err) {
		if (err) {
		  return console.log(err.message);
		}
		response.send({"id":`${this.lastID}`});
	});
	console.log(todo);
});

// Удаление todo по одному
app.delete('/todos',jsonParser,function(request,response) {
	let todo = request.body;
	db.run(queryTDelete, [todo["id"]], function(err) {
		if (err) {
		  return console.log(err.message);
		}
	response.send('Deleted');
	});
	console.log(todo);
});

// Редактирование todo: одно поле или все, зависит от параметров
app.put('/todos',jsonParser,function(request,response) {
	let todo = request.body;
	
	if (typeof todo["title"] == "undefined")
		db.run(queryTUpdate1, [todo["id"]], function(err) {
			if (err) {
			  return console.log(err.message);
			}
			response.send('Updated - Switched');
		});
	else 
		db.run(queryTUpdate2, [todo["completed"],todo["title"],todo["id"]], function(err) {
			if (err) {
			  return console.log(err.message);
			}
			response.send('Updated - Rewrited');
		});
	console.log(todo);
});

app.listen(3001);