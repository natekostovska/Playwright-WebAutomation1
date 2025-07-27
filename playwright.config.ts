import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './test-options';

require('dotenv').config();

export default defineConfig<TestOptions>({
 timeout: 40000,
  globalTimeout: 60000,
expect:{
timeout:2000
},
  retries: 1,
 // reporter: 'html',
 //reporter:'list',
 reporter:[
  ['json',{outputFile: 'test-results/jsonReport.json'}],
  ['junit',{outputFile: 'test-results/junitReport.xml'}],
  ['allure-playwright']

],
  use: {
   globalsQaURL:'https://www.globalsqa.com/demo-site/draganddrop/',
 //  baseURL:'http://localhost:4200/',
 baseURL: process.env.DEV =='1'? 'http://localhost:4201/'
  : process.env.STAGING=='1'?'http://localhost:4202/'
  : 'http://localhost:4200/',

    trace: 'on-first-retry',
   // actionTimeout:20000,
    navigationTimeout:5000,
    extraHTTPHeaders:{
       'Authorization': `Token ${process.env.ACCESS_TOKEN}`
    },
    video:{
      mode:'off',
      size: {width:1920, height:1080}
    }
  },
  globalSetup: require.resolve('./global-setup.ts'),
  globalTeardown: require.resolve('./global-teardown.ts'),
  projects: [
    //  {
    //   name: 'dev',
    //   use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:4201/' },
    //   dependencies:['setup']
    // },

    //   {
    //   name: 'staging',
    //   use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:4202/' },
    //   dependencies:['setup']
    // },

    { name:'setup',testMatch: 'auth.setup.ts'},

    {
      name:'articleSetup',
      testMatch:"newArticle.setup.ts",
      dependencies:['setup'],
      teardown: 'articleCleanUp'
    },

    {
      name:'articleCleanUp',
      testMatch:'articleCleanUp.setup.ts'
    },

      {
      name: 'regression',
      testIgnore:['likesCounter.spec.ts','auth.setup.ts','workingWithAPI.spec.ts','likesCounterGlobal.spec.ts'],
      use: { ...devices['Desktop Chrome'],storageState: '.auth/user.json' },
      dependencies:['setup'],
    },
    
      {
      name: 'chromium',
      testIgnore:['likesCounter.spec.ts','auth.setup.ts','workingWithAPI.spec.ts','likesCounterGlobal.spec.ts'],
      use: { ...devices['Desktop Chrome'],storageState: '.auth/user.json' },
      dependencies:['setup'],
    },
     {
      name: 'likeCounter',
      testMatch:'likesCounter.spec.ts',
      use: { ...devices['Desktop Chrome'],storageState: '.auth/user.json' },
      dependencies:['articleSetup'],
    },

     {
      name: 'likeCounterGlobal',
      testMatch:'likesCounterGlobal.spec.ts',
      use: { ...devices['Desktop Chrome'],storageState: '.auth/user.json' },
    },

     {
       name: 'firefox',
     use: { browserName:'firefox', storageState: '.auth/user.json' , 
     video:{
       mode:'on',
       size: {width:1920, height:1080}
     }},
       dependencies:['setup']
     },

     {
       name: 'pageObjectFullScreen',
       testMatch:'usePageObjects.spec.ts',
       use:{
         viewport:{width:1920, height:1080}
       }
   },

   {
    name:'mobile',
    testIgnore:['likesCounter.spec.ts','workingWithAPI.spec.ts','likesCounterGlobal.spec.ts'],
    testMatch:'testMobile.spec.ts',
    use:{
      ...devices['iPhone 13 Pro'],
    }
   }
  ],

});
