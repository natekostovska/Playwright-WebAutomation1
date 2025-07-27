import {test,expect, request} from "@playwright/test";
import tags from '../test-data/tags.json'

test.beforeEach(async({page})=>
{
   // await page.route('https://conduit-api.bondaracademy.com/api/tags',async route =>{
await page.route('*//**/api/tags',async route =>{
await route.fulfill({
    body: JSON.stringify(tags)
})
    })

    await page.goto('https://conduit.bondaracademy.com/')
})

test('has title',async({page})=>{
 await page.route('*/**/api/articles*',async route => {
       const response= await route.fetch()
       const responseBody=await response.json()
       responseBody.articles[0].title="This is a Mock test title"
       responseBody.articles[0].description="This is a Mock test description"

       await route.fulfill({
        body: JSON.stringify(responseBody)
       })
    })

    await page.getByText('Global Feed').click()
    await expect(page.locator('.navbar-brand')).toHaveText('conduit')
    await expect(page.locator('app-article-list h1').first()).toContainText('This is a Mock test title')
    await expect(page.locator('app-article-list p').first()).toContainText('This is a Mock test description')
})

test('delete article',async({page, request})=>{

  const articleResponse= await request.post('https://conduit-api.bondaracademy.com/api/articles/',{
          data:{
          "article":{"title":"Title Nate1","description":"Description Nate1","body":"Body Nate 1","tagList":[]}
        }
    })

    await expect(articleResponse.status()).toEqual(201)
    await page.getByText('Global Feed').click()
    await page.getByText('Title Nate1').click()
    await page.getByRole('button',{name: "Delete Article"}).first().click()


 await expect(page.locator('app-article-list h1').first()).not.toContainText('Title Nate1')
})

test('create article',async({page,request})=>{
 await page.getByText('New Article').click()
 await page.getByRole('textbox',{name: "Article Title"}).fill('Playwright Learning Test NK')
 await page.getByRole('textbox',{name: "What's this article about"}).fill('About the Playwright')
 await page.getByRole('textbox',{name: "rite your article (in markdown)"}).fill('We use Playwright for automation')
 await page.getByRole('button',{name: "Publish Article"}).click()
 const articleResponse=await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/')
 const articleResponseBody= await articleResponse.json()
 const slugId=articleResponseBody.article.slug


 await expect(page.locator('.article-page h1')).toContainText('Playwright Learning Test NK')
 await page.getByText('Home').click()
 await page.getByText('Global Feed').click()
 await expect(page.locator('app-article-list h1').first()).toContainText('Playwright Learning Test NK')

    const deleteArticleResponse=await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`)
    expect(deleteArticleResponse.status()).toEqual(204)

})