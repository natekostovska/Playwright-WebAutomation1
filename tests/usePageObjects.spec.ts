import {test,expect} from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";
// import {NavigationPage} from '../page-objects/navigationPage'
// import { FormLayoutsPage } from "../page-objects/formLayoutsPge";
// import { DatePickerPage } from "../page-objects/datepickerPage";

test.beforeEach(async({page})=>
{
    await page.goto('http://localhost:4200/')
})

test('navigate to form page',async({page})=>{
    const pm=new PageManager(page)
   // const navigateTo=new NavigationPage(page)
    // await navigateTo.formLayoutsPage()
    // await navigateTo.datepickerPage()
    // await navigateTo.smartTablePage()
    // await navigateTo.toastrPage()
    // await navigateTo.tooltipPage()
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datepickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
})

test('parametrized methods',async({page})=>{
    const pm=new PageManager(page)
    // const navigateTo=new NavigationPage(page)
    // const onFormLayoutsPage=new FormLayoutsPage(page)
    // const onDatePickerPage=new DatePickerPage(page)

    // await navigateTo.formLayoutsPage()
    // await onFormLayoutsPage.submitUsingTheGridFormWithCredentialsAndSelectOption('test@test.com','1232Wer','Option 1')
    // await onFormLayoutsPage.submitInlineFormWithNameEmailAndCheckbox('John Smith','johnSmith@test.com',true)
    // await navigateTo.datepickerPage()
    // await onDatePickerPage.selectCommonDatePickerDateFromToday(10)
    // await onDatePickerPage.selectDatePickerWithRangeFromtoday(6,15)

    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption('test@test.com','1232Wer','Option 1')
    await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox('John Smith','johnSmith@test.com',true)
    await pm.navigateTo().datepickerPage()
    await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(10)
    await pm.onDatePickerPage().selectDatePickerWithRangeFromtoday(6,15)
})


