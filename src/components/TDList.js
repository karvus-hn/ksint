import React from "react";

const urlTODOs = 'http://localhost:3001/todos';

class TDList extends React.Component
{
	state={ 
		todos:[],
		editElem:[],
		ntodo:"",
		userInfo:0,
		dataIsReturned : false,
		showDel:false,
		showEdit:false,
		delElem:''
	};

	componentWillMount = async () => 
	{
		const user=this.props;
		this.setState({userInfo:user['user']});
	}

	componentDidMount = async () =>
	{
		const result = await fetch(urlTODOs+'?userId='+this.state.userInfo['id']);
		this.setState({todos: await result.json(),dataIsReturned : true});
	}

	handleChange = (e) => {
		this.setState({ ntodo: e.target.value });
	}

	// Обработка кнопки "Добавить" - добавление нового дела, POST запрос на сервер
	handleSubmit = (e) => 
	{
		e.preventDefault();
		if (this.state.ntodo.length == 0) {
			return;
		}
		
		const srvTodo= {userId:this.state.userInfo["id"], title:this.state.ntodo};
		fetch(urlTODOs,
			{
				method : 'POST',
				body : JSON.stringify(srvTodo),
				headers: {'Content-Type': 'application/json'}
			})
		.then((response)=>response.json())
		.then((json)=>
		{	
			const newLocalTODO = { title: this.state.ntodo, id: json["id"]};
			this.setState(state => ({
				todos: state.todos.concat(newLocalTODO),
				ntodo: ''
			}));
		});
	}

	// Обработка нажатия на текст todo в списке - смена состояния, PUT запрос на сервер с 1 параметром
	handleClick = (e) =>
	{
		e.preventDefault();
		if (e.target.tagName!='A') return;
		let todos=this.state.todos;
		let ind=todos.findIndex(x=>x.id==e.target.id);
		todos[ind].completed=!todos[ind].completed;
		fetch(urlTODOs,
			{
				method : 'PUT',
				body : JSON.stringify({id:e.target.id}),
				headers: {'Content-Type': 'application/json'}
			})
		this.setState({todos});
	}
	
	// Обработка крестика - подсветка удаляемого элемента и флажок окна удаления
	handleRemove = (e) =>
	{
		e.preventDefault();
		console.log(e.target);
		let delElem=e.target.parentNode;
		delElem.style.backgroundColor='red';
		this.setState({showDel:true,delElem:delElem});
	}

	// Выход пользователя
	handleExit = (e) =>
	{
		e.preventDefault();
		localStorage.removeItem('todos');
		localStorage['isLogged']=false;
		localStorage['user']=-1;
		this.props.handleLoginClick(false,-1);
	}
	
	// Обработка подверждения в окне удаления - DELETE запрос и отключение подстветки, снятие флажка окна удаления
	handleDel = (e) =>
	{
		e.preventDefault();
		this.state.delElem.style.backgroundColor='';
		let todos=this.state.todos;
		let idDel=this.state.delElem.children[0].id;
		let ind=todos.findIndex(x=>x.id==idDel);
		fetch(urlTODOs,
			{
				method : 'DELETE',
				body : JSON.stringify({id:idDel}),
				headers: {'Content-Type': 'application/json'}
			}) 
		todos.splice(ind,1);
		this.setState({todos:todos,showDel:false,delElem:''});
	}
	
	// Обработки отмены в окне удаления - отключение подстветки, снятие флажка окна удаления
	handleCancel = (e) =>
	{
		e.preventDefault();
		this.state.delElem.style.backgroundColor='';
		this.setState({showDel:false,delElem:''});
	}
	
	// Обработка карандашика - флажок окна изменения
	handleEditForm = (e) =>
	{
		e.preventDefault();
		let todos=this.state.todos;
		let idEdit=e.target.parentNode.children[0].id;
		let ind=todos.findIndex(x=>x.id==idEdit);
		this.setState({showEdit:true,editElem:{...this.state.todos[ind]}});
	}
	
	handleChangeEF1 = (e) => {
		let ee = {...this.state.editElem};
		ee["title"] = e.target.value;
		this.setState({ editElem: ee });
	}
	
	handleChangeEF2 = (e) => {
		let ee = {...this.state.editElem};
		ee["completed"] =e.target.checked;
		console.log(ee);
		this.setState({ editElem: ee });
	}
	
	// Обработка подверждения в окне изменения - PUT запрос на сервер для изменения 2 столбцов, снятие флажка окна изменения
	handleSubmitEdit = (e) =>
	{
		e.preventDefault();
		let todos=this.state.todos;
		let ind=todos.findIndex(x=>x.id==this.state.editElem["id"]);
		todos[ind]={...this.state.editElem};
		fetch(urlTODOs,
			{
				method : 'PUT',
				body : JSON.stringify(this.state.editElem),
				headers: {'Content-Type': 'application/json'}
			})
		this.setState({showEdit:false,editElem:[],todos:todos});
	}
	
	handleCancelEdit = (e) =>
	{
		e.preventDefault();
		this.setState({showEdit:false});
	}
	
	render()
	{
		return (
		<>
		{this.state.dataIsReturned?
			<div>
				<h1> Список дел {this.state.userInfo['name']}
					<button onClick={this.handleExit}> Выйти </button>
				</h1>
				<form class='ntd' onSubmit={this.handleSubmit}>
					<label> Новое дело </label>
					<input value={this.state.ntodo} onChange={this.handleChange}/>
					<button> Добавить </button>
				</form>
				<ul>
					{this.state.todos.map(
					(item) => 
						<li onClick={this.handleClick}> 
							<a id={item.id} class={item.completed?'cmpl':''} href=''> {item.title} </a>
							<button class='edit' onClick={this.handleEditForm}></button>
							<button class='del' onClick={this.handleRemove}></button>
						</li>
						)
					}
				</ul>
			</div>
		:<h1>Загрузка</h1>
		}
		{this.state.showDel? <div class='modal delete'> <h2> Удалить?</h2> <button onClick={this.handleDel}>Да</button> <button onClick={this.handleCancel}>Нет</button> </div>:''}
		{this.state.showEdit? <div class='modal editForm'> 
								<h2> Редактировать</h2> 
								<div>
									<label> Содержимое </label>
									<input type="text" value={this.state.editElem["title"]} onChange={this.handleChangeEF1}/>
								</div>
								<div> 
									<label> Завершено </label>
									<input type="checkbox" value={this.state.editElem["completed"]} checked={this.state.editElem["completed"]} onChange={this.handleChangeEF2}/>
								</div>
								<button onClick={this.handleSubmitEdit}>Изменить</button> 
								<button onClick={this.handleCancelEdit}>Отменить</button> 
								</div>
							:''}
		</>
		); // Возможно стоит выделить форму редактирования в новый компонент
	}
};

export default TDList;
