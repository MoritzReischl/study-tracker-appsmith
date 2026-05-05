export default {
	async onPageLoad(){
		storeValue("tableName", "src_daily_o");
		await GetProjectDefault.run();
		await Defaults.onProjectChange(GetProjectDefault.data[0].project_id);
	}
}