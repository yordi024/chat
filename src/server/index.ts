import express, { Express, Request, Response } from 'express'
import logger from 'morgan'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import { db } from '../lib/dbConfig'

const port = process.env.PORT || 3000

const app: Express = express()
const server = createServer(app)
const io = new Server(server, {
    connectionStateRecovery: {}
})

io.on('connection', async (socket) => {
    console.log('a user connected')
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })

    socket.on('chatMessage', async (msg) => {
        let result
        
        const username = socket.handshake.auth.username ?? ''

        try {
            result = await db.execute({
                sql: 'INSERT INTO messages (content, user) VALUES (:msg, :username)',
                args: { msg, username }
            })
        } catch (error) {
            console.log(error)
            return
        }

        console.log('message: ' + msg)
        io.emit('chatMessage', msg, result?.lastInsertRowid?.toString())
    })

    if (!socket.recovered) {
        try {
            const result = await db.execute({
                sql: 'SELECT * FROM messages WHERE id > ?',
                args: [socket.handshake.auth.serverOffset ?? 0]
            })

            result.rows.forEach(row => {
                socket.emit('chatMessage', row.content, row?.id, row.user)
            })
        } catch (error) {
            console.log(error)
        }
    }
})

app.use(logger('dev'))

app.get('/', (req: Request, res: Response) => {
    res.sendFile(process.cwd() + '/src/client/index.html')
})

server.listen(port, () => {
    console.log(`Server running at: 🚀 http://localhost:${port}`)
})