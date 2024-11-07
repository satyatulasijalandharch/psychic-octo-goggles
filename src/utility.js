const { setFailed, getInput } = require("@actions/core");
const { context } = require("@actions/github");
const { Octokit } = require("@octokit/rest");
const { createMessageCard, createFacts } = require("./message");

const getMessage = async () => {
  try {
    const octokit = new Octokit({
      auth: getInput("GITHUB_TOKEN", { required: true }),
    });

    const { data: run } = await octokit.rest.actions.getWorkflowRun({
      ...context.repo,
      run_id: context.runId,
    });
    console.log(run);

    const { data: jobs } = await octokit.rest.actions.listJobsForWorkflowRun({
      ...context.repo,
      run_id: context.runId,
    });
    console.log(jobs);

    const currentJob = jobs.jobs.find(job => job.name === context.job);
    if (!currentJob) {
      throw new Error(`Current job (${context.job}) not found`);
    }

    const currentStepIndex = currentJob.steps.findIndex(step => step.name === "Post Branch Action Test");
    if (currentStepIndex === -1) {
      throw new Error(`Current step (${context.step}) not found`);
    }

    const stepsAboveCurrent = currentJob.steps.slice(0, currentStepIndex).map(step => ({
      name: step.name,
      status: step.conclusion || step.status,
    }));
    console.log(stepsAboveCurrent);

    const overallConclusion = stepsAboveCurrent.every(step => step.status.toUpperCase() === 'SUCCESS') ? 'SUCCESS' : 'FAILURE';

    const themeColor = (overallConclusion.toLowerCase() === 'success')
      ? '00FF00'
      : 'FF0000';

    console.log("Overall conclusion:", overallConclusion);

    return (
      createFacts(run, overallConclusion),
      createMessageCard(run, themeColor, stepsAboveCurrent, overallConclusion)
    );
  } catch (error) {
    console.error("Error in getMessage:", error);
    setFailed(error.message);
    throw error;
  }
};

module.exports = getMessage;
