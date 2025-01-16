import 'reflect-metadata'
import './config/configEnv'
import app from './App'

const port = process.env.PORT || 3001

app.listen(port, () => {
    console.log(
        `[server]: Server is up and running at http://localhost:${port} 🚀`
    )
})

app.get('/', (req, res) => {
    res.redirect('/public/docs')
})

app.get('/ping', (req, res) => {
    res.send('pong')
})
