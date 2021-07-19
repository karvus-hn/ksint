import React from "react";

const urlTODOs = 'http://localhost:3001/todos';

class TDList extends React.Component
{
	state={ 
		todos:[],
		ntodo:"",
		userInfo:0,
		dataIsReturned : false
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

	handleSubmit = (e) => 
	{
		e.preventDefault();
		if (this.state.ntodo.length == 0) {
			return;
		}

		const newTODO = { title: this.state.ntodo, id: Date.now()};
		this.setState(state => ({
			todos: state.todos.concat(newTODO),
			ntodo: ''
		}));
		console.log(this.state.todos);
	}

	handleClick = (e) =>
	{
		e.preventDefault();
		if (e.target.tagName!='A') return;
		let todos=this.state.todos;
		let ind=todos.findIndex(x=>x.id==e.target.id);
		todos[ind].completed=!todos[ind].completed;
		this.setState({todos});
	}

	handleRemove = (e) =>
	{
		e.preventDefault();
		let todos=this.state.todos;
		let ind=todos.findIndex(x=>x.id==e.target.parentNode.children[0].id);
		todos.splice(ind,1);
		this.setState({todos});
	}

	handleExit = (e) =>
	{
		e.preventDefault();
		localStorage.removeItem('todos');
		localStorage['isLogged']=false;
		localStorage['user']=-1;
		this.props.handleLoginClick(false,-1);
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
							<button class='del' onClick={this.handleRemove}></button>
						</li>
						)
					}
				</ul>
			</div>
		:<h1>Загрузка</h1>
		}
		</>
		);
	}
};

export default TDList;
