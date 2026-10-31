import fs from "node:fs";
import path from "node:path";

const username = process.env.LEETCODE_USER;

const query = `
  query userPublicProfile($username: String!) {
    matchedUser(username: $username) {
      profile {
        ranking
      }
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
    }
  }
`;

const res = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { username } }),
});

const { data } = await res.json();
const user = data.matchedUser;

const ranking = user.profile.ranking;
const totalSolved = user.submitStatsGlobal.acSubmissionNum.find(
    (s) => s.difficulty === "All"
).count;

const badgesDir = path.resolve("badges");
if (!fs.existsSync(badgesDir)) {
    fs.mkdirSync(badgesDir, { recursive: true });
}

const badge = {
    schemaVersion: 1,
    label: "LeetCode",
    labelColor: "#FFA116",
    message: `#${ranking} | ${totalSolved} solved`,
    color: "FFA116",
    namedLogo: "leetcode",
    logoColor: "black",
    style: "for-the-badge",
};

fs.writeFileSync(path.join(badgesDir, "leetcode.json"), JSON.stringify(badge, null, 2));
console.log("LeetCode badge updated");
