const Constants = require("./constants");
const constants = Constants.constants;
const download = require('download-git-repo');


async function downloadRepo(repoName) {
	const repo = `${constants.organization}/${repoName}`;
	download(repo, `./tests/${repoName}`, function (err) {
	  console.log(err ? err.message : `${repo} is downloaded`)
	})
}

module.exports = downloadRepo
