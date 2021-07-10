
const e = React.createElement;

const urlUsers='https://jsonplaceholder.typicode.com/users';
const urlTODOs='https://jsonplaceholder.typicode.com/todos';

const Router = window.ReactRouterDOM.HashRouter;
const Route =  window.ReactRouterDOM.Route;
const Link =  window.ReactRouterDOM.Link;
const NavLink =  window.ReactRouterDOM.NavLink;
const Prompt =  window.ReactRouterDOM.Prompt;
const Switch = window.ReactRouterDOM.Switch;
const Redirect = window.ReactRouterDOM.Redirect;


class App extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state={isLogged:false,user:[]};
		this.handleLoginClick = this.handleLoginClick.bind(this);
	}

	componentWillMount()
	{
		this.setState({isLogged:JSON.parse(localStorage.getItem('isLogged')),user:JSON.parse(localStorage.getItem('user'))});
	}

	handleLoginClick = (param1,param2) =>
	{
		console.log(param2);
		this.setState({isLogged:param1,user:param2});
	}

	render()
	{
		console.log(this.state.isLogged);
		return (this.state.isLogged)?
					e('div',{class:'App'},e(TDList,{user:this.state.user,handleLoginClick:this.handleLoginClick})):
					e('div',{class:'App'},e(LoginForm,{handleLoginClick:this.handleLoginClick}));
	}
}

// Компонент "Форма логина"
class LoginForm extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state={ userL:"",userP:"",error:false,user:{}};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChangeL = this.handleChangeL.bind(this);
		this.handleChangeP = this.handleChangeP.bind(this);
	}

	handleSubmit(g)
	{
		g.preventDefault();
		const {handleLoginClick} = this.props;
		fetch(urlUsers+'?username='+this.state.userL+'&website='+this.state.userP)
		.then((response)=>response.json())
		.then((json)=>
		{
			if (json[0]==undefined)
			{
				this.setState({error:true});
			}
			else 
			{
				localStorage['isLogged']=true;
				localStorage['user']=JSON.stringify(json[0]);
				handleLoginClick(true,json[0]);
			}
		});
	}

	handleChangeL(g)
	{
		this.setState({ userL: g.target.value });
	}

	handleChangeP(g)
	{
		this.setState({ userP: g.target.value });
	}

	render ()
	{
		return e("form", {class:'login'}, 
		e("p", null, 
			e("label", null, "Логин"), 
			e("input", {onChange:this.handleChangeL,id: "userId",value:this.state.userL})), 
		e("p", null, 
			e("label", null, "Пароль"), 
			e("input", {onChange:this.handleChangeP,id: "userPsw",type: "password",value:this.state.userP})), 
		e("button", {onClick: this.handleSubmit}, "Войти"),
		this.state.error?e('p',{color:'red'},'Неверный логин или пароль'):'');
	}
};

// Компонент "Список дел"
class TDList extends React.Component
{
	constructor(props)
	{
		super(props);
		this.state={ todos:[],ntodo:"",userInfo:0,dataIsReturned : false};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
		this.handleExit = this.handleExit.bind(this);
	}

	componentWillMount = async () => 
	{
		const user=this.props;
		console.log(user);
		this.setState({userInfo:user['user']});
		//console.log(JSON.parse(localStorage.getItem('todos')));
		//if (localStorage['todos']!=undefined) this.setState({todos:JSON.parse(localStorage.getItem('todos'))});
	}

	componentDidMount = async () =>
	{
		const result = await fetch(urlTODOs+'?userId='+this.state.userInfo['id']);
		
		//console.log(JSON.parse(localStorage.getItem('todos')));
		//if (localStorage['todos']!=undefined) this.setState({todos:JSON.parse(localStorage.getItem('todos')),dataIsReturned : true});
		//else 
			this.setState({todos: await result.json(),dataIsReturned : true});
	}

	handleChange(g) {
		this.setState({ ntodo: g.target.value });
	}

	handleSubmit(g) {
		g.preventDefault();
		if (this.state.ntodo.length == 0) {
			return;
		}

		const newTODO = { title: this.state.ntodo, id: Date.now()};
		this.setState(state => ({
			todos: state.todos.concat(newTODO),
			ntodo: ''
		}));
		//localStorage['todos']=JSON.stringify(this.state.todos);
	}

	handleClick(g)
	{
		g.preventDefault();
		let todos=this.state.todos;
		let ind=todos.findIndex(x=>x.id==g.target.id);
		todos[ind].completed=!todos[ind].completed;
		this.setState({todos});
		//localStorage['todos']=JSON.stringify(this.state.todos);
	}

	handleRemove(g)
	{
		g.preventDefault();
		let todos=this.state.todos;
		let ind=todos.findIndex(x=>x.id==g.target.parentNode.children[0].id);
		todos.splice(ind,1);
		this.setState({todos});
		//localStorage['todos']=JSON.stringify(this.state.todos);
	}

	handleExit(g)
	{
		g.preventDefault();
		localStorage.removeItem('todos');
		localStorage['isLogged']=false;
		localStorage['user']=-1;
		this.props.handleLoginClick(false,-1);
	}
	render()
	{
		return (this.state.dataIsReturned)?e("ul", null,
			e('h1',null,['Список дел '+this.state.userInfo['name'],e('button',{onClick:this.handleExit},'Выйти')]),
			e("form", {onSubmit: this.handleSubmit,class:'ntd'}, 
				e("label", null, "Новое дело"), 
				e("input", {onChange: this.handleChange,value: this.state.ntodo}), 
				e("button", null, "Добавить")),
			this.state.todos.map(
				item => e('li',{onClick:this.handleClick},[e("a", {id: item.id,class:item.completed?'cmpl':'',href:''}, item.title),e('button',{class:'del',onClick:this.handleRemove},'')])
			)
			):e('h1',null,'Загрузка'); 
	}
};

ReactDOM.render(e(App,null),document.getElementById('root'));