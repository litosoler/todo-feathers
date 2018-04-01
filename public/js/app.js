window.Event = new Vue();


Vue.component("sign-in", {
	template:`
	   <div class="text-center login">
	      <div class="form-signin" id="root2">
	        <img class="mb-4" src="https://getbootstrap.com/assets/brand/bootstrap-solid.svg" alt="" width="72" height="72">
	        <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
	        <label for="inputEmail" class="sr-only">Email address</label>
	        <input type="email" v-model="user.email" id="inputEmail" class="form-control" placeholder="Email address" required autofocus>
	        <label for="inputPassword" class="sr-only">Password</label>
	        <input type="password"v-model ="user.password" id="inputPassword" class="form-control" placeholder="Password" required>
	      
	        <div id="sign" class="ui buttons">
	                <button class="ui button"  @click="login">Log In</button>
	                <div class="or"></div>
	                <button class="ui positive button" @click="singUp">Sign Up</button>
	              </div>
	        <p id="error"></p>
	        <p class="mt-5 mb-3 text-muted">&copy; 2017-2018</p>
	      </div>
	    </div>
	`,
	data(){
		return{
			user:{
				email:"",
				password: "",
			},
		}
	},
	methods:{
		init: async function(){
			//verifica si hay una sesion iniciada si no, no hace nada
			try{
				await feathersApp.authenticate();
				this.showTodoPage();
			}catch(error){}
		},
		showTodoPage : ()=>{
			Event.$emit("showTodoPage");
		},
		login: async function(user){
	  		try{
		      	// If we get login information, add the strategy we want to use for login
		      	const payload = Object.assign({ strategy: 'local' }, this.user);
		      	await feathersApp.authenticate(payload);
		    	// If successful, show the chat page
				this.showTodoPage();			   
		 	}catch(error){
		    	// If we got an error, show the login page
		    	this.showLogin(error);
			}
		},
		showLogin : (error)=>{
			console.log(error);
		},
		singUp: async function(){
			await feathersApp.service('users').create(this.user);
    		await this.login(this.user);
		}
	},
	created(){
		this.init();		
	}
})

Vue.component("todo-container", {				
	template:  `
	<div class="ui container" style="padding-top: 20px;">
				<menu-todo></menu-todo>
				<add-todo></add-todo>
				<table class="ui celled striped table">
					  <thead>
					    <tr>
					    	<th class="twelve wide">Todo</th>
					    	<th class="two wide">Completed</th>
					    	<th class="two wide">Erase</th>
					  	</tr>
					  </thead>
					  <tbody>
						<tr v-for="element of incompletedTodos">
					     	<td>
					      		<div class="ui input">
					  				<input type="text" :id="element.id" placeholder="New Todo..." v-model="element.descripcion"  @focusout="updateTodo">	
								</div>
							</td>
					    <td><center>
					      <div class="ui checked checkbox">
					  			<input  :id="element.id" type="checkbox" v-model="element.completed" @change="updateTodo">
					  			<label></label>
								</div>
							</center></td>
							<td>
								<center><i class="trash icon boton" @click="eraseTodo" :id="element.id"></i></center>
								</td>
					    </tr>
					  </tbody>   
				</table>
				<div class="ui accordion" v-if="this.completedTodos.length > 0" >					
				  <div @click="show" class="title" >
				    <i class="dropdown icon"></i>
				    Completed!!
				  	<div>
				  	</div>
				  </div>
				  <div class="content">
						<table  class="ui celled striped table">
					  <thead>
					    <tr>
					    	<th class="twelve wide">Todo</th>
					    	<th class="two wide">Completed</th>
					    	<th class="two wide">Erase</th>
					  	</tr>
					  </thead>
					  <tbody>
						<tr v-for="element of completedTodos">
					     	<td>
					      		<div class="ui input">
					  				<input type="text" :id="element.id" placeholder="New Todo..." v-model="element.descripcion"  @focusout="updateTodo">	
								</div>
							</td>
					    <td><center>
					      <div class="ui checked checkbox">
					  			<input  :id="element.id" type="checkbox" v-model="element.completed" @change="updateTodo">
					  			<label></label>
								</div>
							</center></td>
							<td>
								<center><i class="trash icon boton" @click="eraseTodo" :id="element.id"></i></center>
								</td>
					    </tr>
					  </tbody>   
				</table>
				  </div>
				</div>

	</div>
	`,
    data(){
    	return{
    		todos:[],
    		isShow: false,
    	}
    },
    mounted: function(){
  		this.initTodos();
  	}, 
  	created(){
    	Event.$on('newTodo', ()=> this.initTodos());
    	feathersApp.service('todos').on('created', this.initTodos);
    	feathersApp.service('todos').on('removed', this.initTodos);
    	feathersApp.service('todos').on('updated', this.initTodos);
    	feathersApp.service('todos').on('patched', this.initTodos);
    },
    methods:{
	    initTodos: async function() {
	  		this.todos = await feathersApp.service('todos').
	  					find().then(context => context.data);
  		},
  		updateTodo:async function(event){
  			let id = event.target.id;
  			let row = this.todos.filter( row => row.id == id);
  			row = row[0];
  			await feathersApp.service("todos").
  			patch(row.id,{"descripcion" : row.descripcion, "completed": row.completed}).
  			then(console.log("actualizado"));
  		},
  		eraseTodo: async function(event){
  			let id = event.target.id;
  			await feathersApp.service('todos').remove(id);
  			this.initTodos();
  		},
  		show(){
  			if (this.isShow){
  				$(".title").removeClass("active");
  				$(".content").removeClass("active");
  				this.isShow = false;
  			}else{
  				$(".title").addClass("active");
  				$(".content").addClass("active");
  				this.isShow = true;
  			}
  		}
    },
    computed:{
    	incompletedTodos(){
    		return this.todos.filter(todo => !todo.completed);
    	},
    	completedTodos(){
    		return this.todos.filter(todo => todo.completed);
    	}
    }
})

Vue.component("add-todo", {
	template: `
		<table class="float-right"  >
			 <thead>
	    		<tr>
	    			<th>
	    				<div class="ui input">
						  	<input type="text" placeholder="New Todo..." v-model="dbRow.descripcion">	
						</div>
	    			</th>
	    			<th colspan="2">
	    				<div class="ui buttons">
						  <button class="ui button" @click="cleanInput">Clean</button>
						  <div class="or"></div>
						  <button class="ui positive button" @click="addTodo">Save</button>
						</div>
	    			</th>
	  			</tr>
	  		</thead>
	  	</table>
    `,
    data(){
    	return{
    		dbRow: {
				descripcion: "",
				completed: 0,
			}
    	}
    },
    methods: {
    	addTodo: async function(){
    		let respuesta =  await feathersApp.service("todos").
    						create(this.dbRow);
    		Event.$emit('newTodo');
    		this.cleanInput();
    	},
    	cleanInput(){
    		this.dbRow.descripcion ="";
    	}
    }
					    
} );

Vue.component("menu-todo",{
	template: ` 
		<div id="bar">
		    <div id="btn-log-out" class="ui primary button" @click="logOut">Log Out</div>
		</div>
	`,methods:{
		logOut: async function(){
			await feathersApp.logout();
			Event.$emit("logOut");
		}
	}
})

let app = new Vue({
	el: "#root",
	data(){
		return{
			auth:false
		}
	},
	mounted(){
		Event.$on("showTodoPage", function (){ app.auth = true});
		Event.$on("logOut", function(){app.auth=false})
	}
});