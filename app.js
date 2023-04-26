const PORT = process.env.PORT || 8000 //  for deploying on heroku
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

//  from app.js
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


const app = express()

const newspapers = [
  {
    name: 'thetimes',
    address: 'https://www.thetimes.co.uk/environment/climate-change',
    base: ''
  },
  {
    name: 'guardian',
    address: 'https://theguardian.com/environment/climate-crisis',
    base: ''
  },
  {
    name: 'telegraph',
    address: 'https://www.telegraph.co.uk/climate-change',
    base: 'https://www.telegraph.co.uk'
  }
]

const articles = []

newspapers.forEach(newspaper => {
  axios.get(newspaper.address)
    .then(response => {
      const html = response.data
      
      const $ = cheerio.load(html)
      $('a:contains("climate")', html).each(function () {
        const title = $(this).text()
        const url = $(this).attr('href')

        articles.push({
          title,
          url: newspaper.base + url,
          source: newspaper.name
        })
      })
    })
})

app.get('/', (req,res) => {
  res.json('Welcome to my Climate Change News API, use titles, not <id>s')
})

app.get('/news', (req,res) => {
  
  // axios.get('https://theguardian.com/environment/climate-crisis')
  //   .then((response) => {
  //     const html = response.data
  //     /* console.log(html) */
  //     const $ = cheerio.load(html)

  //     $('a:contains("climate")', html).each(function () {
  //       const title = $(this).text()
  //       const url = $(this).attr('href')
  //       articles.push({
  //         title,
  //         url
  //       })
  //     })
  //     res.json(articles)
  //   }).catch((err) => console.log(err))

  res.json(articles)
})

app.get('/news/:newspaperId', /* async */ (req,res) => {
  /* console.log(req.params.newspaperId) */
  const newspaperId = req.params.newspaperId

  /* const newspaper = newspapers.filter(newspaper => newspaper.name == newspaperId) */

  const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address

  const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

  /* console.log(newspaperAddress) */
  axios.get(newspaperAddress)
    .then(response => {
      const html = response.data
      const $ = cheerio.load(html)
      const specificArticles = []

      $('a:contains("climate")', html).each(function () {
        const title = $(this).text()
        const url = $(this).attr('href')
        specificArticles.push({
          title,
          url: newspaperBase + 1,
          source: newspaperId
        })
      })
      res.json(specificArticles)
    }).catch(err => console.log(err))
})

//  so  you can add the last line
//  app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))


//  yeah this one
module.exports = app;