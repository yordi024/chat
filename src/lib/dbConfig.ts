import { createClient } from '@libsql/client'
import dotenv from 'dotenv'

dotenv.config()

if (!process.env.DB_URL) {
    throw new Error('DB_URL is not defined')
}

const db = createClient({
    url: process.env.DB_URL || '',
    authToken: process.env.DB_TOKEN
})

db.execute(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        user TEXT NOT NULL
    )
`)

export {
    db
};