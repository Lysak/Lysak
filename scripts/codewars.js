import { load } from "cheerio";
import fs from "node:fs";
import path from "node:path";

// Get Codewars username from environment variable
const username = process.env.CODEWARS_USER;
const url = `https://www.codewars.com/users/${username}`;

// Create badges folder if it doesn't exist
const badgesDir = path.resolve("badges");
if (!fs.existsSync(badgesDir)) {
    fs.mkdirSync(badgesDir, { recursive: true });
}

// Fetch the profile page (global fetch in Node 24)
const res = await fetch(url);
const html = await res.text();
const $ = load(html);

const stat = $(".stat-category .stat");

const rank = stat.first().text().trim().replace("Rank:", "").trim();

const honor = stat.eq(1).text().trim().replace("Honor:", "").trim();

const totalCompletedKata = stat.eq(2).text().trim().replace("Total Completed Kata:", "").trim();

// Create JSON for Shields.io
const badge = {
    schemaVersion: 1,
    label: "Codewars",
    labelColor: "#B1361E",
    message: `${rank} | ${honor} honor | ${totalCompletedKata} kata`,
    color: "B1361E",
    namedLogo: "codewars",
    logoColor: "white",
    style: "for-the-badge"
};

// Save JSON to file
fs.writeFileSync(path.join(badgesDir, "codewars.json"), JSON.stringify(badge, null, 2));
console.log("Codewars badge updated");
