import {test,expect, request} from "@playwright/test";

test('Like counter increase',async({page})=>{
await page.goto('https://conduit.bondaracademy.com',{waitUntil:'networkidle'})
await page.getByText('Global Feed').click()
const firstLikebutton= page.locator('app-article-preview').first().locator('button')
await expect(firstLikebutton).toContainText('0')
await firstLikebutton.click()
await expect(firstLikebutton).toContainText('1')

})