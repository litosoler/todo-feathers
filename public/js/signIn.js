let signApp = new Vue({
	el: "#root2",
	methods:{
		login: async function(credentials){
			try {
			    
			    if(!credentials) {
			      // Try to authenticate using the JWT from localStorage
			      await client.authenticate();
			    } else {
			      // If we get login information, add the strategy we want to use for login
			      const payload = Object.assign({ strategy: 'local' }, credentials);

			      await client.authenticate(payload);
			    }

			    // If successful, show the chat page
			    showChat();
			}catch(error){
			    // If we got an error, show the login page
			    showLogin(error);
			}
		},
	},
	created(){
		login();
	}
});

