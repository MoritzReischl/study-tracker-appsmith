export default {
	isTokenFresh(session){
		if(!session?.access_token) return false;
		const exp = session.expires_at;
		const now = Math.floor(Date.now()/1000);
    return Number.isFinite(exp) && now < (exp - 30);
	},
	
	async refreshTokens(){
		if(!this.isTokenFresh(appsmith.store.session)){
			const res = await Refresh.run();
			await storeValue("session", {
				access_token: res.access_token,
				refresh_token: res.refresh_token,
				expires_at: res.expires_at,
				user: res.user
			}, true);
		}
	}
}