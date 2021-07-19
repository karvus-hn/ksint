import React from "react";

const urlUsers = 'http://localhost:3001/users';

class LoginForm extends React.Component
{
	state = { 
		userL:new String(),
		userP:"",
		error:false,
		user:{}
	};

	handleSubmit = (e) =>
	{
		e.preventDefault();
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

	handleChangeL = (e) =>
	{
		this.setState({ userL: e.target.value });
	}

	handleChangeP = (e) =>
	{
		this.setState({ userP: e.target.value });
	}

	render ()
	{
		return (
		<form class='login'>
			<p>
				<label> Логин </label>
				<input id='userId' value={this.state.userL} onChange={this.handleChangeL.bind(this)}/>
			</p>
			<p>
				<label> Пароль </label>
				<input id='userPsw' type='password' value={this.state.userP} onChange={this.handleChangeP.bind(this)}/>
			</p>
			<button onClick={this.handleSubmit.bind(this)}>Войти</button>
			{this.state.error?<p color='red'> Неверный логин или пароль</p>:''}
		</form>
		);
	}
};

export default LoginForm;
