import { request, expect } from "@playwright/test";
import fs from 'fs';
import path from 'path';

const authDir = path.resolve(__dirname, '.auth');
const authFile = path.join(authDir, 'user.json');
const slugFile = path.join(authDir, 'slug.json');

async function globalSetup() {
    if (!fs.existsSync(authDir)) {
        fs.mkdirSync(authDir);
    }

    const context = await request.newContext();

    const responseToken = await context.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {
            "user": { "email": "pwtest29Nate@test.com", "password": "Nate!123" }
        }
    });

    const responseBody = await responseToken.json();
    const accessToken = responseBody.user.token;

    // Prepare user JSON structure (or load a template if needed)
    const user = {
        origins: [
            {
                localStorage: [
                    { name: "accessToken", value: accessToken }
                ]
            }
        ]
    };

    fs.writeFileSync(authFile, JSON.stringify(user, null, 2));

    // Create article
    const articleResponse = await context.post('https://conduit-api.bondaracademy.com/api/articles/', {
        data: {
            "article": { "title": "Global Likes test article", "description": "Description Nate1", "body": "Body Nate 1", "tagList": [] }
        },
        headers: {
            Authorization: `Token ${accessToken}`
        }
    });

    await expect(articleResponse.status()).toBe(201);
    const articleData = await articleResponse.json();
    const slugId = articleData.article.slug;

    fs.writeFileSync(slugFile, JSON.stringify({ slugId }, null, 2));

    await context.dispose();
}

export default globalSetup;
