import './App.css';
import React from "react";
import LoginForm from './components/LoginForm';
import TDList from './components/TDList';

class App extends React.Component
{

	state = {
		isLogged:false,
		user:[]
	};

	componentWillMount= () =>
	{
		this.setState({isLogged:JSON.parse(localStorage.getItem('isLogged')),user:JSON.parse(localStorage.getItem('user'))});
	}

	handleLoginClick = (param1,param2) =>
	{
		this.setState({isLogged:param1,user:param2});
	}

	render (){ 
		return(
		<div className="App">
			{this.state.isLogged? <TDList handleLoginClick={this.handleLoginClick} user={this.state.user}/>
				: <LoginForm handleLoginClick={this.handleLoginClick} />}
		</div>
		);
	}
}

export default App;
