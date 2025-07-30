import { request, expect } from "@playwright/test";
import fs from 'fs';
import path from 'path';

const authFile = path.resolve(__dirname, '.auth/user.json');
const slugFile = path.resolve(__dirname, '.auth/slug.json');

async function globalTeardown() {
    const context = await request.newContext();

    if (!fs.existsSync(authFile) || !fs.existsSync(slugFile)) {
        console.warn('Auth or slug files not found, skipping teardown.');
        return;
    }

    const user = JSON.parse(fs.readFileSync(authFile, 'utf-8'));
    const accessToken = user.origins[0].localStorage[0].value;

    const slugData = JSON.parse(fs.readFileSync(slugFile, 'utf-8'));
    const slugId = slugData.slugId;

    const deleteArticleResponse = await context.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
        headers: {
            Authorization: `Token ${accessToken}`
        }
    });

    expect(deleteArticleResponse.status()).toBe(204);

    await context.dispose();
}

export default globalTeardown;
