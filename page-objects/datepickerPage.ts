import {Page, expect} from "@playwright/test";
import { HelperBase } from "./helperBase";

export class DatePickerPage extends HelperBase{

   // private readonly page:Page

    constructor(page:Page){
        //this.page=page
        super(page)
    }

    async selectCommonDatePickerDateFromToday(numberofdaysFromToday: number){
    const calendarInputfield=this.page.getByPlaceholder('Form Picker')
    await calendarInputfield.click()
    const dateToAssert=await this.selectDateInTheCalendar(numberofdaysFromToday)
    await expect(calendarInputfield).toHaveValue(dateToAssert)
    }

    async selectDatePickerWithRangeFromtoday(startDateFromToday: number, endDateFromToday:number){
    const calendarInputfield=this.page.getByPlaceholder('Range Picker')
    await calendarInputfield.click()
    const dateToAssertStart=await this.selectDateInTheCalendar(startDateFromToday)
    const dateToAssertEnd=await this.selectDateInTheCalendar(endDateFromToday)
    const dateToAssert=`${dateToAssertStart} - ${dateToAssertEnd}`
    await expect(calendarInputfield).toHaveValue(dateToAssert)
    }


    private async selectDateInTheCalendar(numberofdaysFromToday:number){
    let date=new Date()
    date.setDate(date.getDate()+numberofdaysFromToday)
    const expectedDate=date.getDate().toString()

    const expectedMonthShort=date.toLocaleString('En-US',{month:'short'})
    const expectedMonthLong=date.toLocaleString('En-US',{month:'long'})
    const expectedYear=date.getFullYear()
    const dateToAssert=`${expectedMonthShort} ${expectedDate}, ${expectedYear}`

    let calendarMonthAndYear=await this.page.locator('nb-calendar-view-mode').textContent()
    const expectedMonthAndYear= ` ${expectedMonthLong} ${expectedYear}`

    while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
        await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calendarMonthAndYear=await this.page.locator('nb-calendar-view-mode').textContent()
    }
    await this.page.locator('.day-cell.ng-star-inserted:not(.bounding-month)').getByText(expectedDate, { exact: true }).click();

    // const dayCell=this.page.locator('[class="day-cell ng-star-inserted"]')
    // const rangeCell=this.page.locator('[class="range-cell day-cell ng-star-inserted"]')
    // if(await dayCell.first().isVisible){
    //     await dayCell.getByText(expectedDate,{exact:true}).click()
    // }
    // else{
    //     await rangeCell.getByText(expectedDate,{exact:true}).click()
    // }
    return dateToAssert
    }
}