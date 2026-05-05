export default {
  async signup(email, password, username) {
  	if(!email || !password){
			showAlert("Email and password are required. Try again.","error");
			return;
		}
		if(password.length < 6){
			showAlert("Weak password. Should be at least 6 characters.", "error");
		}
		try{
			await Auth_Signup.run({email, password, username});
			storeValue('user_mail',email)
			navigateTo("Confirm email");
    	showAlert("Check your email to confirm.", "info");
		} catch(e){
			showAlert(e?.message || "Signup failed", "error");
		}
  }
}