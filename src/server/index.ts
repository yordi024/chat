import express, { Express, Request, Response} from 'express'
import logger from 'morgan'
import { Server } from 'socket.io'
import { createServer } from 'node:http'

const port = process.env.PORT || 3000

const app: Express = express()
const server = createServer(app)
const io = new Server(server, {
   connectionStateRecovery: {} 
})

io.on('connection', (socket) => {
    console.log('a user connected')
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })

    socket.on('chatMessage', (msg) => {
        console.log('message: ' + msg)
        io.emit('chatMessage', msg)
    })
})

app.use(logger('dev'))

app.get('/', (req: Request, res: Response) => {
    res.sendFile(process.cwd() + '/src/client/index.html')
})

server.listen(port, () => {
    console.log(`Server running at: 🚀 http://localhost:${port}`)
})