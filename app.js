require('dotenv').config()
const server =require('./models/server.models')

const servidor = new server()



servidor.listen()