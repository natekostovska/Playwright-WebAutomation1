import {test as setup,expect} from "@playwright/test";

setup('Create new article',async({request})=>{
      const articleResponse= await request.post('https://conduit-api.bondaracademy.com/api/articles/',{
              data:{
              "article":{"title":"Likes test article","description":"Description Nate1","body":"Body Nate 1","tagList":[]}
            }
        })
    
        await expect(articleResponse.status()).toEqual(201)
        const response=await articleResponse.json()
        const slugId=response.article.slug
        process.env['SLUGID']=slugId
})