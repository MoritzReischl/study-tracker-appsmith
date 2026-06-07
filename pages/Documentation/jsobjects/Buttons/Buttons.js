export default {
  async delete() {
    try {	
      await Auth.callApi(DeleteRow, { id: appsmith.store.delete_id });
      await Auth.callApi(SelectAll);

      closeModal('delete_modal');
      showAlert("The row was deleted.", "warning");
    } catch(e) {
      showAlert([
        e?.message,
        DeleteRow.data?.message,
        DeleteRow.data?.details,
        DeleteRow.data ? " (Code " + DeleteRow.data.code + ")" : null
      ]
        .filter(Boolean)
        .join(". "),
        "error"
      );
    }
  },
	
  async insert() {
    try {
      await Auth.runAuthenticated(() => InsertRow.run());
      await Auth.callApi(SelectAll);

      showAlert("Row has been inserted successfully.", "success");
    } catch(e) {
      showAlert([
        e?.message,
        InsertRow.data?.message,
        InsertRow.data?.details,
        InsertRow.data ? " (Code " + InsertRow.data.code + ")" : null
      ]
        .filter(Boolean)
        .join(". "),
        "error"
      );
    }
  },

  async getUpdateDefaults() {
    await Auth.callApi(SelectUpdateDefault, {
      project_id: String(appsmith.store.UpdateDefaultId)
    });
  },
	
  async update() {
    try {
      await Auth.runAuthenticated(() => UpdateRow.run());
      await Auth.callApi(SelectAll);

      closeModal("update_modal");
      showAlert("Row has been updated successfully.", "success");
    } catch(e) {
      showAlert([
        e?.message,
        UpdateRow.data?.message,
        UpdateRow.data?.details,
        UpdateRow.data ? " (Code " + UpdateRow.data.code + ")" : null
      ]
        .filter(Boolean)
        .join(". \r\n"),
        "error"
      );
    }
  },
	
  async refreshTableAndButtons() {
    await Auth.callApi(SelectAll);
    await Fields_and_Display.loadProjects();
  }
}