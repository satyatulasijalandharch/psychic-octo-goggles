const createMessageCard = (run, themeColor, steps) => ({
  "@type": "MessageCard",
  "@context": "http://schema.org/extensions",
  themeColor,
  summary: `${run.name}`,
  sections: [
    {
      activityTitle: run.name,
      activitySubtitle: `${run.head_repository.full_name} [#${run.run_number}](${run.html_url})`,
      activityImage: run.actor.avatar_url,
      facts: createFacts(run),
      potentialAction: createActions(run),
    },
    {
      title: "ALL STEPS",
      facts: steps.map(step => ({ name: step.name, value: step.status.toUpperCase() })),
    },
  ],
});

const createFacts = ({ head_commit, event, head_branch, overallConclusion }) => [
  { name: "Author:", value: head_commit.author.name },
  { name: "Event:", value: `\`${event.toUpperCase()}\`` },
  { name: "Branch:", value: `\`${head_branch.toUpperCase()}\`` },
  { name: "Status:", value: `\`${overallConclusion}\`` },
  { name: "Commit:", value: head_commit.message },
];

const createActions = ({ html_url, head_repository, head_sha }) => [
  {
    "@type": "OpenUri",
    name: "View Workflow",
    targets: [{ os: "default", uri: html_url }],
  },
  {
    "@type": "OpenUri",
    name: "View Commit",
    targets: [
      {
        os: "default",
        uri: `${head_repository.html_url}/commit/${head_sha}`,
      },
    ],
  },
];

module.exports = {
  createFacts,
  createActions,
  createMessageCard,
};