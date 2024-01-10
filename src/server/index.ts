import express, { Express, Request, Response} from 'express'
import logger from 'morgan'

const port = process.env.PORT || 3000

const app: Express = express()

app.use(logger('dev'))

app.get('/', (req: Request, res: Response) => {
    res.sendFile(process.cwd() + '/src/client/index.html')
})

app.listen(port, () => {
    console.log(`Server running at: 🚀 http://localhost:${port}`)
})