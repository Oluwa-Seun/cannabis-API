const PORT = process.env.PORT || 3000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const strains = [{
        name: 'weedmaps',
        address: 'https://weedmaps.com/strains',
        base: 'https://weedmaps.com'
            //TODO add more website for better scrapping and to get more result (strains)
    },
    {
        name: 'leafy',
        address: 'https://leafly.com/strains',
        base: 'https://leafly.com'
    },
    {
        name: 'bud',
        address: 'https://bud.com/strains',
        base: 'https://bud.com'
    },

]

const articles = []

strains.forEach(cannabis => {
    axios.get(cannabis.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            $('a:contains("strains")', html).each(function() {
                const title = $(this).text()
                const url = $(this).attr('href')
                articles.push({
                    title,
                    url: cannabis.base + url,
                    source: cannabis.name
                })
            })

        })
        .catch((error) => {
            console.log(error)
        })

    app.get('/', (req, res) => {
        res.json('Welcome to my Cannabis web scraper API')
    })

    app.get('/strains', (req, res) => {
        res.json(articles)

    })

    // TODO fix for better endpoint reach 
    app.get('/strain/:strainsID', (req, res) => {
        console.log(req.params.strainsid)
        const strainsId = req.params.cannabisId
        const strainsAddress = canna.filter(cannabi => cannabi.name == cannabisId)[0].address
        const strainsBase = canna.filter(cannabi => cannabi.name == cannabisId)[0].base
        axios.get(strainsAddress)
            .then(response => {
                const html = response.data
                const $ = cheerio.load(html)
                const specificArticles = []
                $('a:contains("strains")', html).each(function() {
                    const title = $(this).text()
                    const url = $(this).attr('href')
                    specificArticles.push({
                        title,
                        url: strainsBase + url,
                        source: strainsId
                    })
                })
                res.json(specificArticles)
            })
    })
})
app.listen(PORT, () => console.log(`SERVER RUNNING ON port: http://localhost:${PORT}`))