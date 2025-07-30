import { EyesFixture } from '@applitools/eyes-playwright/fixture';
import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './test-options';

require('dotenv').config();

export default defineConfig<TestOptions,EyesFixture>({
 timeout: 40000,
 // globalTimeout: 60000,
expect:{
timeout:2000,
toMatchSnapshot:{maxDiffPixels:50}
},
  retries: 1,
 // reporter: '@applitools/eyes-playwright/reporter',
 //reporter:'list',
 reporter:[
  ['json',{outputFile: 'test-results/jsonReport.json'}],
  ['junit',{outputFile: 'test-results/junitReport.xml'}],
 // ['allure-playwright']
 ['html']

],
  use: {
    /* Configuration for Eyes VisualAI */
    eyesConfig: {
      /* The following and other configuration parameters are documented at: https://applitools.com/tutorials/playwright/api/overview */
      apiKey: process.env.API_KEY, // alternatively, set this via environment variable APPLITOOLS_API_KEY
 type: 'ufg',
browsersInfo: [
  { name: 'chrome', width: 800, height: 600 },
  { name: 'firefox', width: 1024, height: 768 },
  {
    name: 'safari',
    width: 375,
    height: 667,
   // deviceScaleFactor: 2,
   // isMobile: true
  },
],
    },

   globalsQaURL:'https://www.globalsqa.com/demo-site/draganddrop/',
 //  baseURL:'http://localhost:4200/',
 baseURL: process.env.DEV =='1'? 'http://localhost:4201/'
  : process.env.STAGING=='1'?'http://localhost:4202/'
  : 'http://localhost:4200/',
    viewport:{height:720,width:1280},
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
      use: { ...devices['Desktop Chrome'],storageState: '.auth/user.json' },
      dependencies:['setup'],
    },
    
      {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'],storageState: '.auth/user.json'}
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

  webServer:{
    command:'npm run start:ci',
    url:'http://localhost:4200/'
     timeout: 120 * 1000, // 2 minutes
  reuseExistingServer: !process.env.CI
  }

});
