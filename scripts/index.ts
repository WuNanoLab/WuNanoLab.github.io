import fs from "fs";
import { fromURL } from "cheerio";
import Turndown from "turndown";
import { GoogleGenAI } from "@google/genai";

const gemini = new GoogleGenAI({});

async function publications() {
    const page = await fromURL('https://www.wunanolab.com/lab-publications');
    const html = page('div.wixui-tabs').html();
    const response = await gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: '将网页中的参考文献转换为markdown格式：\n' + html,
    });
    console.log(response.text);
}

function convertDate(time: string): string {  // YYYY-MM-DD
    const day = time.match(/\d+ days ago/);
    if (day?.length) {
        const d = parseInt(day[0]);
        const date = new Date();
        date.setDate(date.getDate() - d);
        return date.toISOString().split('T')[0];
    }
    return new Date(time).toISOString().split('T')[0];
}

async function convertPost(post: WixPost): Promise<string | void> {
    const page = await fromURL(post.link);
    const content = page('section[data-hook="post-description"]').html();
    if (!content) {
        console.error(`page not found: ${post.title}`);
        return;
    }
    const image = await fetch(post.media.wixMedia.image.url);
    const td = new Turndown();
    td.addRule('img', {
        filter: 'img',
        replacement: (content, node) => ''
    })
    const md = `---
layout: post
title: "${post.title}"
cover-img: /assets/img/${post.media.wixMedia.image.id}
---\n` + td.turndown(content).trim();
    try {
        const name = `${post.firstPublishedDate.split('T')[0]}-${post.slug}`;
        fs.writeFileSync(`../_posts/${name}.md`, md);
        fs.writeFileSync(
            `../assets/img/${post.media.wixMedia.image.id}`,
            Buffer.from(await image.arrayBuffer())
        );
        return name;
    } catch (e) {
        console.error(`write file error: ${post.title}`);
        console.error(e);
    }
}

async function news() {
    for (let page = 1; page < 12; page++) {
        const response = await fetch(
            `https://www.wunanolab.com/_api/blog-frontend-adapter-public/v2/post-feed-page?includeContent=true&languageCode=en&page=${page}&pageSize=10&type=ALL_POSTS`,
            {
                headers: {
                    Authorization: ''
                }
            }
        );
        const data = await response.json();
        const posts: WixPost[] = data.postFeedPage.posts.posts;
        posts.forEach(convertPost);
    }
}

news();
