const git = require("simple-git")();
const cron = require("node-cron");
const fs = require('fs');
require("dotenv").config();

function generateRandomTextName(length = 10) {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomText = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomText += characters.charAt(randomIndex);
  }

  return randomText;
}

function deleteExistingTextFiles() {
  fs.readdirSync(__dirname).forEach((file) => {
    if (file.endsWith(".txt")) {
      fs.unlinkSync(file);
      console.log(`Deleted existing file: ${file}`);
    }
  });
}

const commitToGitHub = async () => {
  try {
    const date = new Date().toISOString();
    const fileContent = `Ghost commit on ${date}`;
    deleteExistingTextFiles();

    const filePath = `./${generateRandomTextName()}.txt`;

    fs.writeFileSync(filePath, fileContent);

    await git.addConfig("user.name", process.env.REPO_OWNER_NAME);

    await git.addConfig("user.email", process.env.REPO_OWNER_EMAIL);
    
    await git.add(filePath, Buffer.from(fileContent).toString("base64"));

    await git.commit(process.env.COMMIT_MESSAGE);

    await git.push("origin", "master");

    console.log("Commit created and pushed successfully.");
  } catch (error) {
    console.error("Error creating and pushing commit:", error);
  }
};

cron.schedule('*/1 * * * *', () => {
console.log("Running daily commit job...");
commitToGitHub();
});

console.log("CRON job scheduled.");

setInterval(() => {}, 1000);
