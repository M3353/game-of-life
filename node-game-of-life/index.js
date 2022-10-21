const express = require('express')
const bodyParser = require('body-parser')
const admin = require('./admin-queries')
const player = require('./player-queries')

const app = express()
const port = 5431

app.use(bodyParser.json())
app.use(
	bodyParser.urlencoded({
    extended: true,
	})
)

app.get('/', (req, res) => {
	res.json({ info: 'Node.js, Express, and Postgres API' })
})
app.get('/boards', player.getBoards)
app.put('/boards/:id', player.updateBoard)
//app.get('/boards/admin/', (req, res) => {
//	res.json({ info: 'Admin Api for creating  boards' })
//})
app.put('/admin/:id', admin.createBoard)
// app.delete('/boards/admin/:id', admin.deleteBoard)

app.listen(port,  () => {
	console.log(`App running on port ${port}.`)
})
