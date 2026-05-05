export default {
	async delete() {
		try{	
			await Auth.refreshTokens();
			await DeleteRow.run({id:appsmith.store.delete_id});
			await SelectAll.run();
			closeModal('delete_modal');
			showAlert("The row was deleted.","warning");
		} catch(e){
			showAlert([
				e?.message,
				DeleteRow.data?.message,
				DeleteRow.data?.details,
				DeleteRow.data?" (Code "+DeleteRow.data.code+")":null]
				.filter(Boolean)
				.join(". "),
				"error")
		};
	},
	
	async insert(){
		try{
			await Auth.refreshTokens();
			await InsertRow.run();
			await SelectAll.run();
			showAlert("Row has been inserted successfully.","success");
		} catch(e) {
			showAlert([
				e?.message,
				InsertRow.data?.message,
				InsertRow.data?.details,
				InsertRow.data?" (Code "+InsertRow.data.code+")":null]
				.filter(Boolean)
				.join(". "),
				"error")
		};
	},

	async getUpdateDefaults(){
		const id = project_table.triggeredRow.id;
		await SelectDefault.run({project_id: String(id)});
	},
	
	async update(){
		try{
			await Auth.refreshTokens();
			await UpdateRow.run();
			SelectAll.run();
			closeModal("update_modal");
			showAlert("Row has been updated successfully.","success")
		} catch(e) {
			showAlert([
				e?.message,
				UpdateRow.data?.message,
				UpdateRow.data?.details,
				UpdateRow.data?" (Code "+UpdateRow.data.code+")":null]
				.filter(Boolean)
				.join(". \r\n"),
				"error")
		}
	}
}