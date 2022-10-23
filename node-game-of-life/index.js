const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const admin = require('./admin-queries')
const player = require('./player-queries')
const middleware = require('./middleware')


const app = express()
const port = 5431

// middleware
app.use(cors)
app.use(bodyParser.json())
app.use(
	bodyParser.urlencoded({
    extended: true,
	})
)

// queries
app.get('/', (req, res) => {
	res.json({ info: 'Node.js, Express, and Postgres API' })
})
app.get('/boards', player.getBoards)
app.get('/boards/:id', player.getBoardById)
app.put('/boards/:id', player.updateBoard)
app.post('/admin/:id', middleware.validateBoard, admin.createBoard)
app.delete('/admin/:id', admin.deleteBoard)

app.listen(port,  () => {
	console.log(`App running on port ${port}.`)
})
