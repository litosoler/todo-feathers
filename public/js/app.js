Vue.component("todo-container", {
	template:  `
				<table ref="myTabla" class="ui table">
					  <thead>
					    <tr>
					    	<th class="ten wide">Todo</th>
					    	<th class="six wide">Completed</th>
					  	</tr>
					  </thead>
					  <tbody>
						<tr v-for="(element, index) of todos">
					     	<td>
					      		<div class="ui input">
					  				<input type="text" :id="index" placeholder="New Todo..." v-model="element.descripcion"  @focusout="updateTodo">	
								</div>
							</td>
					      	<td>
					      		<div class="ui checked checkbox">
					  				<input  :id="index" type="checkbox" v-model="element.completed" @change="updateTodo">
					  				<label></label>
								</div>
							</td>
					    </tr>
					  </tbody>
					   <add-todo></add-todo>
				</table>
	`,
    data(){
    	return{
    		todos:undefined,
    	}
    },
    mounted: function(){
  		this.initTodos();
  	},
    methods:{
	    	initTodos: async function() {
	  		this.todos = await feathersApp.service('todos').find().then(context => context.data);
  		},
  		updateTodo:async function(event){
  			let id = event.target.id;
  			let row = this.todos[id];
  			 await feathersApp.service("todos").patch(row.id,{"descripcion" : row.descripcion, "completed": row.completed}).then(console.log("actualizado"));
  		}
    }

})

Vue.component("add-todo", {
	template: `
		 <tfoot>
    		<tr>
    			<th>
    				<div class="ui input">
					  	<input type="text" placeholder="New Todo..." v-model="dbRow.descripcion">	
					</div>
    			</th>
    			<th>
    				<div class="ui buttons">
					  <button class="ui button">Clean</button>
					  <div class="or"></div>
					  <button class="ui positive button">Save</button>
					</div>
    			</th>
  			</tr>
  		</tfoot>
    `,
    data(){
    	return{
    		dbRow: {
    			id: undefined,
    			descripcion: "",
    			prioridad: undefined,
    			completed: false
    		}
    	}
    }
					    
} );


let app = new Vue({
	el: "#root"
});