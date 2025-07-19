import {test,expect} from "@playwright/test";

test.beforeEach(async({page},testInfo)=>
{
    await page.goto('http://www.uitestingplayground.com/ajax')  // need to use await for those who use promise
    await page.getByText('Button Triggering AJAX Request').click()
    testInfo.setTimeout(testInfo.timeout+2000)
})

test('auto waiting', async({page})=>{
    const successButton=page.locator('.bg-success')
 //   await successButton.click()

 //   const text = await successButton.textContent()

// -- Comment out multiple lines CTRL +K , CTRL+C
//  await successButton.waitFor({state:"attached"})
//  const text=await successButton.allTextContents()
//    expect(text).toContain('Data loaded with AJAX get request.')

await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout:20000})
})    

test('alternative waits', async({page})=>{
const successButton=page.locator('.bg-success')

// wait for element
//await page.waitForSelector('.bg-success')

// wait for particular response
//await page.waitForResponse('http://www.uitestingplayground.com/ajaxdata')

// wait for network calls to be completed (NOT RECOMENDED)
await page.waitForLoadState('networkidle')

await page.waitForTimeout(5000)
// waitForURL

const text=await successButton.allTextContents()
expect(text).toContain('Data loaded with AJAX get request.')

})    

test('timeouts', async({page})=>{
//test.setTimeout(10000)
test.slow()
const successButton=page.locator('.bg-success')
await successButton.click()

})   