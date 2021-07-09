const e = React.createElement;

const urlUsers='https://jsonplaceholder.typicode.com/users';
const urlTODOs='https://jsonplaceholder.typicode.com/todos';

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
		fetch(urlUsers+'?username='+this.state.userL+'&website='+this.state.userP)
		.then((response)=>response.json())
		.then((json)=>
		{
			if (json[0]==undefined)
			{
				this.setState({error:true});
				console.log(this.state);
				render();
			}
			else 
			{
				sessionStorage['isLogged']=true;
				console.log(json[0]);
				TDList();
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
		return e("form", null, 
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

function TDList()
{
	const li1=e('li',{},'smthg');
	const container = e('ul',{},[li1,li1,li1]);
	ReactDOM.render(container,document.getElementById('root'));
}

if (JSON.parse(sessionStorage.getItem('isLogged')))
	TDList();
else ReactDOM.render(e(LoginForm,null),document.getElementById('root'));
