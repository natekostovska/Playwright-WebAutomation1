import { request, expect } from "@playwright/test"
import user from '../Playwright-WebAutomation1/.auth/user.json'
import fs from 'fs'

async function globalSetup() {
    const authFile = '.auth/user.json'
    const context=await request.newContext()

         const responseToken= await context.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data:{
          "user":{"email": "pwtest29Nate@test.com","password": "Nate!123"}
        }
    })
    const responseBody= await responseToken.json()
    const accessToken= responseBody.user.token
    user.origins[0].localStorage[0].value=accessToken
    fs.writeFileSync(authFile,JSON.stringify(user))

    process.env['ACCESS_TOKEN']=accessToken


          const articleResponse= await context.post('https://conduit-api.bondaracademy.com/api/articles/',{
                  data:{
                  "article":{"title":"Global Likes test article","description":"Description Nate1","body":"Body Nate 1","tagList":[]}
                },
                headers:{
                    Authorization: `Token ${process.env.ACCESS_TOKEN}`
                }
            })
        
            await expect(articleResponse.status()).toEqual(201)
            const response=await articleResponse.json()
            const slugId=response.article.slug
            process.env['SLUGID']=slugId
    
}

export default globalSetup;