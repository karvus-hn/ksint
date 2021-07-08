const e = React.createElement;

const urlUsers='https://jsonplaceholder.typicode.com/users';
const urlTODOs='https://jsonplaceholder.typicode.com/todos';
var logE=false;

async function handleSubmit(g) 
{
	g.preventDefault();
	console.log('Отправлена форма.');
	userName=document.getElementById('userId').value;
	psw=document.getElementById('userPsw').value;
	let response = await fetch(urlUsers+'?username='+userName+'&website='+psw);
	if (response.ok) 
	{ 
	  let json = await response.json();
	  if (json[0]==undefined)
	  {
		logE=true;
		LoginForm();
	  }
	  else 
	  {
	  sessionStorage['isLogged']=true;
	  console.log(json[0]);
	  TDList();
	  }
	} 
	else {
	  alert("Ошибка HTTP: " + response.status);
	}
	
}

function LoginForm() 
{
	const login= e('p',{},[e('label',{},'Логин'),e('input',{id:'userId'},null)]);
	const psw=e('p',{},[e('label',{},'Пароль'),e('input',{id:'userPsw',type:'password'},null)]);
	const sbmButton=e('button',{onClick:handleSubmit},"Войти");
	const logError= logE?e('p',{color:'red'},'Неверный логин или пароль'):'';
	const container = e('form',{},[login,psw,sbmButton,logError]);
	ReactDOM.render(container,document.getElementById('root'));
}

function TDList()
{
	const li1=e('li',{},'smthg');
	const container = e('ul',{},[li1,li1,li1]);
	ReactDOM.render(container,document.getElementById('root'));
}

if (JSON.parse(sessionStorage.getItem('isLogged')))
	TDList();
else LoginForm();
