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

function addPDF() {
    const pdfList = ["Small (2024)", "Advanced Healthcare Materials (2024)", "ACS Applied Nano Materials (2021)", "Elsevier (Book, 2024)", "Journal of Physics D: Applied Physics (2025)", "AIP Advances (2025)", "IEEE Transactions on Magnetics (2025)", "Physica Scripta (2025)", "Biomedical Physics & Engineering Express (2025)", "Journal of Vacuum Science & Technology B (2024)", "Journal of Neural Engineering (2023)", "Nanotechnology (2022)", "Journal of Neural Engineering (2022)", "Frontiers in Microbiology (2016)", "ACS Sensors (2017)", "Biosensors and Bioelectronics (2019)", "ACS Applied Materials & Interfaces (2022)", "Frontiers in Microbiology (2019)", "npj Spintronics (2024)", "ACS Applied Bio Materials (2023)", "Advanced Materials Interfaces (2023)", "Sensors and Actuators A: Physical (2023)", "ACS Applied Nano Materials (2020)", "ACS Applied Materials & Interfaces (2020)", "ACS Applied Materials & Interfaces (2021)", "ACS Applied Materials & Interfaces (2019)", "Small (2017)", "The Journal of Physical Chemistry C (2021)", "The Journal of Physical Chemistry C (2022)", "ACS Applied Nano Materials (2022)", "Journal of Magnetism and Magnetic Materials (2019)", "Journal of Physics D: Applied Physics (2019)", "The Journal of Physical Chemistry C (2019)", "Journal of Applied Physics (2019)", "Nanotechnology (2020)", "arXiv:2501.11196", "arXiv:2411.17870"];
    let md = fs.readFileSync('../_pages/research.md', 'utf-8');
    for (const item of pdfList) {
        const idx = md.indexOf(item);
        const end = md.indexOf(')', idx + item.length);
        const fileName = item.replace(/[\/:\s]/g, '_');
        const filePath = `/assets/att/${fileName}.pdf`;
        const iconPath = `/assets/img/download.svg`;
        md = `${md.slice(0, end + 1)}[![PDF](${iconPath})](${filePath})${md.slice(end + 1)}`;
    }
    console.log(md);
    fs.writeFileSync('../_pages/research.md', md);
}
