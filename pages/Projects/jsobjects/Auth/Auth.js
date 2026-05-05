export default {
  // Lies exp aus dem JWT (fallback 0)
  _jwtExp(token) {
    try {
      const p = JSON.parse(atob((token || "").split(".")[1]));
      return typeof p?.exp === "number" ? p.exp : 0; // Sekunden
    } catch {
      return 0;
    }
  },

  // Prüft, ob Token noch gültig ist (mit 30s Puffer)
  isTokenFresh(session) {
    const at = session?.access_token;
    if (!at) return false;
    const now = Math.floor(Date.now() / 1000);
    const exp = session?.expires_at || this._jwtExp(at); // entweder gespeicherte expires_at oder aus JWT
    return exp && now < (exp - 30);
  },

  // Einmalig sperren, damit nicht parallel refreshed wird
  _lock: false,

  async refreshTokens() {
    const s = appsmith.store.session || {};
    if (!s.refresh_token) return;            // nichts zu tun ohne RT
    if (this.isTokenFresh(s)) return;        // noch frisch
    if (this._lock) return;                  // schon im Gange

    this._lock = true;
    try {
      // WICHTIG: Refresh-Action so bauen, dass sie this.params.refresh_token nutzt
      const res = await Refresh.run({ refresh_token: s.refresh_token });

      // expires_at berechnen (Sekunden seit Epoch)
      const now = Math.floor(Date.now() / 1000);
      const expires_at = res.expires_in ? now + res.expires_in : this._jwtExp(res.access_token);

      await storeValue(
        "session",
        {
          ...s, // behalte vorhandene user-daten
          access_token: res.access_token,
          refresh_token: res.refresh_token || s.refresh_token,
          expires_at,  // ⚠️ konsistenter Name (nicht expired_at)
          user: s.user || res.user || null
        },
        true
      );
    } catch (e) {
      // Refresh fehlgeschlagen → sauber abmelden
      await storeValue("session", undefined, true);
      showAlert("Sitzung abgelaufen. Bitte neu einloggen.", "warning");
      navigateTo("Login");
      throw e;
    } finally {
      this._lock = false;
    }
  }
};
