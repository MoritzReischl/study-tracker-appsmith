export default {
  async onProjectChange(projectId) {
    if (!projectId) return;

    await Auth.refreshTokens();

    // clear downstream
    await storeValue("defaultActivityId", null);
    await storeValue("defaultAssignmentId", null);
    await storeValue("defaultTaskId", null);
    await storeValue("defaultProjectId", projectId);

    await GetActivityDefault.run();
    await SelectAllActivities.run();

    const activityId = GetActivityDefault.data?.[0]?.activity_id;

    if (!activityId) return;
    await this.onActivityChange(activityId);
  },

  async onActivityChange(activityId) {
    if (!activityId) return;

    await Auth.refreshTokens();

    // clear downstream
    await storeValue("defaultAssignmentId", null);
    await storeValue("defaultTaskId", null);

    await storeValue("defaultActivityId", activityId);

    await SelectAssignmentOptions.run();
    await GetAssignmentDefault.run();

    const assignmentId =
      GetAssignmentDefault.data?.[0]?.src_tasks?.assignment_id ??
      SelectAssignmentOptions.data?.[0]?.assignment_id;

    await GetSelectedActivity.run();

    if (!assignmentId) return;
    await this.onAssignmentChange(assignmentId);
  },

  async onAssignmentChange(assignmentId) {
    if (!assignmentId) return;

    await Auth.refreshTokens();

    await storeValue("defaultAssignmentId", assignmentId);

    await GetTaskDefault.run();

    await GetTaskOptions.run();

    const taskId =
      GetTaskDefault.data?.[0]?.task_id ??
      GetTaskOptions.data?.[0]?.task_id;

    await storeValue("defaultTaskId", taskId);
  }
};