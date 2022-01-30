const PORT = process.env.PORT || 3000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const canna = [{
    name: 'weedmaps',
    address: 'https://weedmaps.com/strains',
    base: ''
        //TODO add more website for better scrapping and to get more result (strains)
}]

const articles = []

canna.forEach(cannabi => {
    axios.get(cannabi.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("strains")', html).each(function() {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: cannabi.base + url,
                    source: cannabi.name
                })
            })

        })
})

app.get('/', (req, res) => {
    res.json('Welcome to my Cannabis web scraper API')
})

app.get('/strains', (req, res) => {
    res.json(articles)
})

// TODO fix for better endpoint reach 
app.get('/cannabis:cannabisId', (req, res) => {
    const cannabisId = req.params.cannabisId

    const cannabiAddress = canna.filter(cannabi => cannabi.name == cannabisId)[0].address
    const cannabiBase = canna.filter(cannabi => cannabi.name == cannabisId)[0].base


    axios.get(cannabiAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("strains")', html).each(function() {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: ncannabiBase + url,
                    source: cannabisId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})


app.listen(PORT, () => console.log(`SERVER RUNNING ON port: http://localhost:${PORT}`))