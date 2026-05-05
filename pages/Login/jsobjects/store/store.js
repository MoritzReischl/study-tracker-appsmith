export default {
	// Not visible for production environment without prior login of user
  checkStore () {
    return appsmith.store;
  },
	setAnonKey () {
    return storeValue("SUPABASE_ANON_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6bXp0bnhsc3dpa3pzeXpyaXJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2Njc1NzksImV4cCI6MjA3MDI0MzU3OX0.IDysuTga1lkUeS056oNSNKaR1yDhRF2Cc6S03z0A5uo");
  }
}