import {test,expect} from "@playwright/test";

/*test.beforeAll(({page})=>{

})*/

test.beforeEach(async({page})=>
{
    await page.goto('/')  // need to use await for those who use promise
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})

test('Locator syntax rules', async({page})=>{
//by Tag name
await page.locator('input').first().click()  // is not unique element thats why we add first 

// by id
page.locator('#inputEmail')

// by class value
page.locator('.shape-rectangle')

// by attribute
page.locator('[placeholder="Email"]')

// by class value full
page.locator('[input-full-width size-medium status-basic shape-rectangle nb-transition]')

// combine different selectors by tag and by attribute without space
page.locator('input[placeholder="Email"].shape-rectangle')
// we can also add second attribute 
page.locator('input[placeholder="Email"][nbinput]')

// by Xpath (NOT RECOMMENDED)
page.locator('//*[@id="inputEmail"]')

// by partial text match
page.locator(':text["Using"]')

// by exact text match
page.locator(':text-is["Using the Grid"]')
})

test('User facing locators',async ({page})=>{
await page.getByRole('textbox',{name:'Email'}).first().click() // type of element we try to interact with there are 67 https://playwright.dev/docs/locators#locate-by-role
await page.getByRole('button',{name:'Sign in'}).first().click()

await page.getByLabel('Email').first().click()
await page.getByPlaceholder('Jane Doe').click()
await page.getByText('Using the Grid').click()
await page.getByTestId('SignIn').click()
await page.getByTitle('IoT Dashboard').click()

})

test('locating child elements',async ({page})=>{
// radio buttons
await page.locator('nb-card nb-radio :text-is("Option 1")').click()
await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()

await page.locator('nb-card').getByRole('button',{name:'Sign in'}).first().click()
//index
await page.locator('nb-card').nth(3).getByRole('button').click()

})

test('locating parent elements',async ({page})=>{
await page.locator('nb-card',{hasText: "Using the Grid"}).getByRole('textbox',{name:'Email'}).click()
await page.locator('nb-card',{has: page.locator("#inputEmail1")}).getByRole('textbox',{name:'Email'}).click()

await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox',{name:'Email'}).click()
await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox',{name:'Password'}).click()

await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"}).getByRole('textbox',{name:'Email'}).click()

// not recommended

await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox',{name:'Email'}).click()
})

test('Reusing the locators', async({page})=>{
const basicForm=page.locator('nb-card').filter({hasText: "Basic form"})
const emailField=basicForm.getByRole('textbox',{name:'Email'})

await emailField.fill('test@test.com')
await basicForm.getByRole('textbox',{name:'Password'}).fill('Welcome123')
await basicForm.locator('nb-checkbox').click()
await basicForm.getByRole('button').click()
await expect(emailField).toHaveValue('test@test.com')
})

test('extracting values', async({page})=>{
        //single test value
   const basicForm=page.locator('nb-card').filter({hasText: "Basic form"})
   const buttonText=await basicForm.locator('button').textContent()
   expect (buttonText).toEqual('Submit')     

// all text values

const allRadioButtonLabel=await page.locator('nb-radio').allTextContents()
expect(allRadioButtonLabel).toContain("Option 1")

// input value

const emailField=basicForm.getByRole('textbox',{name:"Email"})
await emailField.fill('test@test.com')
const emailValue=await emailField.inputValue()
expect(emailValue).toEqual('test@test.com')

// attribute value

const placeHolderValue=await emailField.getAttribute('placeholder')
expect(placeHolderValue).toEqual('Email')


})


test('assertions', async({page})=>{

     const basicFormButton=page.locator('nb-card').filter({hasText: "Basic form"}).locator('button')

    // General Assertions
        const value =5
        expect(value).toEqual(5)

    const text=await basicFormButton.textContent()
    expect(text).toEqual('Submit')

    // Locator assertions (they have their own wait for 5 seconds)
    await expect(basicFormButton).toHaveText('Submit')

    // Soft assertion

    await expect.soft(basicFormButton).toHaveText('Submit')
    await basicFormButton.click()
})


/*test.afterEach()
test.afterAll()
*/
// u can test.describe.only or test.describe.skip
 /* test.describe('suite1',()=>{
    test.beforeEach(async({page})=>
{
    await page.getByText('Charts').click()
})
test('the first test',async({page})=>{
    await page.getByText('Form Layouts').click()

})

test('navigate to datepicker page',async({page})=>{
    await page.getByText('Datepicker').click()
})
})


test.describe('suite2',()=>{
    test.beforeEach(async({page})=>
{
    await page.getByText('Forms').click()
})
test('the first test',async({page})=>{
    await page.getByText('Form Layouts').click()

})

test('navigate to datepicker page',async({page})=>{
    await page.getByText('Datepicker').click()
})
}) */

/* test.describe('test suite 1',()=>{
    test('the first test',()=>{

    })

    test('the first test',()=>{

    })

    test('the first test',()=>{

    })
})

test.describe('test suite 2',()=>{
    test('the first test',()=>{

    })

    test('the first test',()=>{

    })

    test('the first test',()=>{

    })
}) */