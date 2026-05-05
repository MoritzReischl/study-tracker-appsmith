export default{
	bootstrap() {
    if (!appsmith.store.session?.access_token) navigateTo("Landing page");
  }
}