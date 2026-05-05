export default {
  _refreshing: null, // holds a Promise while refresh is in flight

  isTokenFresh(session) {
    if (!session?.access_token) return false;
    const exp = session.expires_at;
    const now = Math.floor(Date.now() / 1000);
    return Number.isFinite(exp) && now < (exp - 30);
  },

  async refreshTokens() {
    // If already refreshing, wait for it
    if (this._refreshing) {
      await this._refreshing;
      return;
    }

    const session = appsmith.store.session;

    if (this.isTokenFresh(session)) return;

    const refreshToken = session?.refresh_token;
    if (!refreshToken) throw new Error("No refresh token available");

    // Single-flight guard
    this._refreshing = (async () => {
      const res = await Refresh.run(); // your Appsmith API action
      // Expect res: { access_token, refresh_token, expires_at, user }
      await storeValue(
        "session",
        {
          access_token: res.access_token,
          refresh_token: res.refresh_token, // note: Supabase rotates it!
          expires_at: res.expires_at,
          user: res.user,
        },
        true
      );
    })();

    try {
      await this._refreshing;
    } finally {
      this._refreshing = null;
    }
  },
	
	async callApi(action, params = undefined) {
    await Auth.refreshTokens();

    if (params !== undefined) {
      return action.run(params);
    }

    return action.run();
  }
}