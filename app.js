// const cron = require("node-cron");
// const { Octokit } = require("@octokit/rest");
// require("dotenv").config();

// const octokit = new Octokit({
//   auth: process.env.ACCESS_TOKEN,
// });

// const commitToGitHub = async () => {
//   try {
//     const date = new Date().toISOString();
//     const fileContent = `Ghost commit on ${date}`;
//     const content = Buffer.from(fileContent).toString("base64");

//     const response = await octokit.repos.createOrUpdateFileContents({
//       owner: process.env.REPO_OWNER_NAME,
//       repo: process.env.REPO_NAME,
//       path: "ghost-commit.txt" + date,
//       message: process.env.COMMIT_MESSAGE,
//       content,
//       committer: {
//         name: process.env.REPO_OWNER_NAME,
//         email: process.env.REPO_OWNER_EMAIL,
//       },
//     });

//     console.log(`Commit created: ${response.data.commit.html_url}`);
//   } catch (error) {
//     console.error("Error creating commit:", error);
//   }
// };

// // cron.schedule("0 0 * * *", () => {
//   console.log("Running daily commit job...");
//   commitToGitHub();
// // });

// console.log("CRON job scheduled.");

// setInterval(() => {}, 1000);
const git = require('simple-git')();
const cron = require('node-cron');
require("dotenv").config();

const commitToGitHub = async () => {
  try {
    const date = new Date().toISOString();
    const fileContent = `Ghost commit on ${date}`;
    const filePath = './test.txt'; // Path to the file you want to commit

    // Create or update the file content
    await git.addConfig('user.name', process.env.REPO_OWNER_NAME);
    await git.addConfig('user.email', process.env.REPO_OWNER_EMAIL);
    await git.add(filePath, Buffer.from(fileContent).toString('base64'));

    // Commit the changes
    await git.commit(process.env.COMMIT_MESSAGE);

    // Push the changes to the remote repository (assuming you have the necessary permissions)
    await git.push('origin', 'master');

    console.log('Commit created and pushed successfully.');

  } catch (error) {
    console.error('Error creating and pushing commit:', error);
  }
};

// Schedule the job to run daily at a specific time (adjust as needed)
// cron.schedule('0 0 * * *', () => {
  console.log('Running daily commit job...');
  commitToGitHub();
// });

console.log('CRON job scheduled.');

// Keep the script running
setInterval(() => {}, 1000);
