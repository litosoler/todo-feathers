window.Event = new Vue();

Vue.component("todo-container", {
	template:  `
	<div class="ui container" style="padding-top: 20px;">
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
						<tr v-for="(element, index) of todos">
					     	<td>
					      		<div class="ui input">
					  				<input type="text" :id="index" placeholder="New Todo..." v-model="element.descripcion"  @focusout="updateTodo">	
								</div>
							</td>
					    <td><center>
					      <div class="ui checked checkbox">
					  			<input  :id="index" type="checkbox" v-model="element.completed" @change="updateTodo">
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
	`,
    data(){
    	return{
    		todos:undefined,
    	}
    },
    mounted: function(){
  		this.initTodos();
  	}, 
  	created(){
    	Event.$on('newTodo', ()=> this.initTodos());
    },
    methods:{
	    initTodos: async function() {
	  		this.todos = await feathersApp.service('todos').
	  					find().then(context => context.data);
  		},
  		updateTodo:async function(event){
  			let id = event.target.id;
  			let row = this.todos[id];
  			await feathersApp.service("todos").
  			patch(row.id,{"descripcion" : row.descripcion, "completed": row.completed}).
  			then(console.log("actualizado"));
  		},
  		eraseTodo: async function(event){
  			let id = event.target.id;
  			await feathersApp.service('todos').remove(id);
  			this.initTodos();
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
    	},
    	cleanInput(){
    		console.log("cleanTodo")
    		this.dbRow.descripcion ="";
    	}
    }
					    
} );


let app = new Vue({
	el: "#root"
});