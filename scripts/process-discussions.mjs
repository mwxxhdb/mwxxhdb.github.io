import { graphql } from "@octokit/graphql";
import fs from "fs";
import path from "path";
import 'dotenv/config'

const args = process.argv;
if (!args || args.length < 3) {
    console.error("No arguments provided");
    process.exit(1);
}

if (!fs.existsSync(args[2])) {
    console.error("File does not exist");
    process.exit(1);
}

function getFrontMatter(lines) {
    const frontMatter = {};
    let remaining = [];

    let started = false;
    let ended = false;
    for (let i = 0; i < lines.length; i++) {
        const trimedLine = lines[i].trim();
        if (ended) {
            remaining.push(lines[i]);
            continue;
        }

        if (started) {
            if (trimedLine === '----->') {
                ended = true;
                continue;
            }

            const [key, value] = trimedLine.split(':');
            frontMatter[key.trim()] = value.trim();
        } else if (trimedLine === '<!-----') {
            started = true;
        } else {
            remaining.push(lines[i]);
        }
    }

    while (remaining.length > 0 && remaining[0].trim() === '') {
        remaining.shift();
    }
    return [frontMatter, remaining];
}

async function writeDiscussion(repoOwner, repoName, discussionNumber) {
    console.log(`Write discussion https://github.com/${repoOwner}/${repoName}/discussions/${discussionNumber}`);

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const graphqlAuth = graphql.defaults({
        headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
        },
    });

    const gql = String.raw;
    const res = await graphqlAuth(
        gql`
          query {
            repository(owner: "${repoOwner}", name: "${repoName}") {
              pinnedDiscussions(last: 100) {
                nodes {
                  discussion {
                    number
                  }
                }
              }
              discussion(number: ${discussionNumber}) {
                title
                body
                createdAt
                updatedAt
                category{
                  slug
                }
                labels(last: 10) {
                  nodes {
                    name
                  }
                }
              }
            }
          }
    `
    );

    const pinnedNumbers = res.repository.pinnedDiscussions.nodes.map(node => node.discussion.number);
    const discussion = res.repository.discussion;
    const category = discussion.category.slug;

    const dir = path.join('src/content/blog', category);
    fs.mkdirSync(dir, { recursive: true });

    const lines = discussion.body.split('\r\n');
    const [frontMatter, contentLines] = getFrontMatter(lines);
    if (!frontMatter.title) frontMatter.title = discussion.title;
    if (!frontMatter.pubDatetime) frontMatter.pubDatetime = discussion.createdAt;
    if (!frontMatter.modDatetime) frontMatter.modDatetime = discussion.updatedAt;
    if (!frontMatter.tags) frontMatter.tags = discussion.labels.nodes.map(label => label.name);
    if (!frontMatter.featured) frontMatter.featured = `${pinnedNumbers.includes(discussionNumber)}`;
    if (!frontMatter.description) frontMatter.description = discussion.title;

    let result = [];
    result.push('---');
    const matterKeys = Object.keys(frontMatter).sort();
    for (let key of matterKeys) {
        const value = frontMatter[key];
        if (typeof value === 'string') {
            result.push(`${key}: ${value}`);
        } else if (typeof value === 'object' && value.length) {
            result.push(`${key}:`);
            for (let v of value) {
                result.push(`  - ${v}`);
            }
        } else {
            console.error(`Invalid value for ${key}: ${value}`);
        }
    }
    result.push('---');
    result.push(...contentLines);
    result.push(`<script src="https://giscus.app/client.js" data-repo="${repoOwner}/${repoName}" data-mapping="number" data-term="${discussionNumber}" data-reactions-enabled="1" data-emit-metadata="0" data-input-position="bottom" data-theme="transparent_dark" data-lang="zh-CN" data-loading="lazy" crossorigin="anonymous" async></script>`);

    fs.writeFileSync(path.join(dir, `${discussionNumber}.md`), result.join('\n'));
}

function deleteDiscussion(category, discussionNumber) {
    const filepath = path.join('src/content/blog', category, `${discussionNumber}.md`);
    if (fs.existsSync(filepath)) {
        console.log(`Deleting ${filepath}`);
        fs.rmSync(filepath);
    }
}


const event = JSON.parse(fs.readFileSync(args[2], 'utf-8'));
const action = event.action;
const discussionNumber = event.discussion?.number;
const regex = /https:\/\/github.com\/([\w.-]+)\/([\w.-]+)\/discussions\/\d+/;
const matches = regex.exec(event.discussion?.html_url);
if (matches.length < 3) {
    console.error("Invalid discussion URL:", event.discussion?.html_url);
    process.exit(1);
}
const repoOwner = matches[1];
const repoName = matches[2];

switch (action) {
    case 'created':
    case 'edited':
    case 'pinned':
    case 'unpinned':
    case 'labeled':
    case 'unlabeled':
        writeDiscussion(repoOwner, repoName, discussionNumber);
        break;
    case 'deleted':
        deleteDiscussion(event.discussion?.category?.from?.slug, discussionNumber);
        break;
    case 'category_changed':
        deleteDiscussion(event.changes?.category?.from?.slug, discussionNumber);
        writeDiscussion(repoOwner, repoName, discussionNumber);
        break;
}
