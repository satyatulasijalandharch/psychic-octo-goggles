const { setFailed, getInput } = require("@actions/core");
const { context } = require("@actions/github");
const { Octokit } = require("@octokit/rest");
const { createMessageCard } = require("./utils");

const getMessage = async () => {
  try {
    const { data: run } = await new Octokit({
      auth: getInput("GITHUB_TOKEN", { required: true }),
    }).rest.actions.getWorkflowRun({
      ...context.repo,
      run_id: context.runId,
    });

    const themeColor = (run.status?.toLowerCase() === 'in_progress' || run.status?.toLowerCase() === 'completed')
      ? '00FF00'
      : 'FF0000';
    return createMessageCard(run, themeColor);
  } catch (error) {
    console.error("Error in getMessage:", error);
    setFailed(error.message);
    throw error;
  }
};

module.exports = getMessage;
