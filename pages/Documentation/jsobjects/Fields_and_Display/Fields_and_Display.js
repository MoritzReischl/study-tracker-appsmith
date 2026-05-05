export default {
  async loadProjects() {
    await Auth.callApi(SelectAllProjects);
  },

  projectOptions() {
    return (SelectAllProjects.data || []).map(row => ({
      value: row.id,
      label:
        row.name +
        " (" +
        [row.start_timestamp, row.deadline].filter(Boolean).join(", ") +
        ")"
    }));
  },

  async loadActivities() {
		await Auth.callApi(SelectAllActivities);
  },

  activitiesOptions() {
    return (SelectAllActivities.data || []).map(row => ({
      value: row.src_activities.id,
      label:
        row.src_activities.name +
        " (" +
        [
          row.src_activities.input_qn_proc_g_metric,
          row.src_activities.output_qn_gen_g_metric,
          row.src_activities.ql_g_metric
        ]
          .filter(Boolean)
          .join(", ") +
        ")"
    }));
  },

  async loadAssignments() {
		await Auth.callApi(SelectAssignmentOptions);
  },

  assignmentOptions() {
    return (SelectAssignmentOptions.data || []).map(row => ({
      value: row.id,
      label:
        row.name +
        " (" +
        [row.deadline, row.time_inv_g_hours_manual]
          .filter(Boolean)
          .join(", ") +
        ")"
    }));
  },

  async loadTasks() {
		await Auth.callApi(GetTaskOptions);
  },

  taskOptions() {
    return (GetTaskOptions.data || []).map(row => ({
      value: row.id,
      label: [row.main_task_name, row.sub_task_name]
        .filter(Boolean)
        .join(": ")
    }));
  }
}