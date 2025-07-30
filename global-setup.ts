import { request, expect } from "@playwright/test";
import user from './.auth/user.json';
import fs from 'fs';
import path from 'path';

const authFile = path.resolve(__dirname, '.auth/user.json');
const slugFile = path.resolve(__dirname, '.auth/slug.json');

async function globalSetup() {
    const context = await request.newContext();

    const responseToken = await context.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {
            "user": { "email": "pwtest29Nate@test.com", "password": "Nate!123" }
        }
    });
    const responseBody = await responseToken.json();
    const accessToken = responseBody.user.token;

    user.origins[0].localStorage[0].value = accessToken;
    fs.writeFileSync(authFile, JSON.stringify(user, null, 2));

    // Create an article with the token
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

    // Save slug to file for teardown
    fs.writeFileSync(slugFile, JSON.stringify({ slugId }, null, 2));

    await context.dispose();
}

export default globalSetup;
