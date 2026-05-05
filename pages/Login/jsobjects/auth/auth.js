export default {
  async login(email, password) {
    try{
			const res = await Auth_Login.run({email, password});
	    await storeValue("session", {
	      access_token: res.access_token,
	      refresh_token: res.refresh_token,
	      user: res.user,
				expires_at: res.expires_at
	    }, true);
  	  navigateTo("Documentation");
		} catch(e){
			showAlert(e?.message || "Login failed", "error");
		}
  }
};