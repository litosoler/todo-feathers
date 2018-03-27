var vm = new Vue({
  el: '#app',
  data: ()=> {
    return {
    	context: {},
    	entries: {},
    	entry: {},
    	errors: undefined,
    	loginError: undefined,
    	user: {},
    	action: '',
    	title: '',
    	modalTitle: '',
    	index: -1,
    	isAuth: false
    }
  },
  mounted: function(){
  	this.user = {
  		email: '',
  		password: ''
  	}
  },
  methods:{
  	init: async function() {
  		this.context = await feathersApp.service('directory').find();
  		this.entries = this.context.data;
  		this.title = 'Contactos';
  	},
  	showModal: function(){
  		this.action = 'new';
  		this.modalTitle = 'New Entry'
  		$(this.$refs.modalNew).modal('show');
  	},
  	showEditModal: function(index, entry){
  		this.entry = entry;
  		this.action = 'edit';
  		this.index = index;
  		this.modalTitle = 'Edit a entry';
  		$(this.$refs.modalNew).modal('show');
  	},
  	save: function(){
  		let _this = this;
  		if(this.action == 'new'){
	  		feathersApp.service('directory').create({
		      name: _this.entry.name,
	  			telephone: _this.entry.telephone,
	  			mail: _this.entry.mail
		    }).then((newEntry) => {
		    	this.entries.push(newEntry);
		    	$(this.$refs.modalNew).modal('hide');
		    	this.cleanEntry();
		    }).catch((error) =>{
		    	this.errors = error;
		    });
		  } else {
		  	feathersApp.service('directory').update(_this.entry.id, {
		      name: _this.entry.name,
	  			telephone: _this.entry.telephone,
	  			createdAt: _this.entry.createdAt,
	  			mail: _this.entry.mail
		    }).then((editedEntry) => {
		    	this.entries[this.index] = editedEntry;
		    	$(this.$refs.modalNew).modal('hide');
		    	this.cleanEntry();
		    }).catch((error) =>{
		    	this.errors = error;
		    });
		  }
  	},
  	deleteEntry: async function(index, id){
  		feathersApp.service('directory').remove(id).then((response) => {
  			this.entries.splice(index, 1);
  		}).catch((error) =>{
  			console.log(error);
  		});
  	},
  	cleanEntry: function(){
			this.entry = {
  			name: "",
  			telephone: "",
  			mail: ""
  		};
  		this.errors = undefined;
  		this.index = -1;
  		this.action = '';
  	},
  	authenticate: async function(){
  		try{
	  		await feathersApp.authenticate({
				  strategy: 'local',
				  email: this.user.email,
				  password: this.user.password
				});
				this.isAuth = true;
				this.loginError = {};
				this.init();
	  	} catch(error){
	  		console.log(error);
	  		this.loginError = error;
	  		this.isAuth = false;
	  	}
  	},
  	logout: async function(){
  		await feathersApp.logout();
  		this.isAuth = false;
  		this.user = {
	  		email: '',
	  		password: ''
	  	}
  	}
  }
});
