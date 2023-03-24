const fs = require('fs/promises')
const express = require('express')
const cors = require('cors')
const PORT = 3000
const _ = require('lodash')
const { v4: uuid } = require('uuid')

const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('This is working!')
})

app.get('/outfit', (req, res) => {

    const top = ['Black', 'Green', 'Gold']
    const shoes = ['Gray', 'Gray Dark', 'Brown', 'Red']
    const tshirt = ['Blue', 'Purple', 'White']

    res.json({
        top: _.sample(top),
        shoes: _.sample(shoes),
        tshirt: _.sample(tshirt)
    })
})

app.post('/comments', async (req, res) => {
    const id = uuid()
    const content = req.body.content

    if(!content) {
        return res.sendStatus(400)
    }

    function generateRandomIntegerInRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }
    
    let randomNumber = generateRandomIntegerInRange(1, 100)

    await fs.mkdir('data/comments', { recursive: true })
    await fs.writeFile(`data/comments/${'comment' + randomNumber}.txt`, content)

    res.status(201).json({
        id
    })
})

app.get('/comments/:id', async (req, res) => {
    const id = req.params.id
    let content

    try {
        content = await fs.readFile(`/data/comments/${id}.txt`, 'utf-8')
    } catch(err) {
        return res.sendStatus(404)
    }

    res.json({
        content
    })
})


app.listen(PORT, () => console.log(`API server is running on port ${PORT}`))