export default {
  // returns a fresh access token in store
  async ensureAccessToken() {
    const s = appsmith.store.session;
    if (!s) throw new Error("No session");
    const now = Math.floor(Date.now()/1000);
    // refresh a bit early (30s skew)
    if (s.expires_at && now < s.expires_at - 30) return s.access_token;

    const r = await Auth.refreshTokens.run({ refresh_token: s.refresh_token });
    const updated = {
      ...s,
      access_token: r.access_token,
      refresh_token: r.refresh_token || s.refresh_token,
      expires_at: r.expires_at || (now + (r.expires_in ?? 3600)),
      user: r.user || s.user
    };
    await storeValue("session", updated, true);
    return updated.access_token;
  },

  async logout() {
    try {
      await this.ensureAccessToken();        // make sure token isn't expired
      await logout.run();               // POST /auth/v1/logout
    } catch (e) {
      // If refresh or remote logout fails, we'll still clear local state
      showAlert("Signing out on this device.", "warning");
    } finally {
      await storeValue("session", null, true);
      navigateTo("Login");
    }
  }
};
