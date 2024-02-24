const express = require("express");
const paths = require("../paths/paths");
const cors = require("cors");
const fileupload = require("express-fileupload");
const { sequelize } = require("../database/config");

//codigo aumentado para los sockets
const http = require("http");
const { Server: SocketServer } = require("socket.io");

//ECMACSCRIPT 6

class Server {
  constructor() {
    this.port = 8080;
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new SocketServer(this.server);
    this.databaseConnection();
    this.middlewares();
    this.routes();
  }

  async databaseConnection() {
    try {
      await sequelize.authenticate();
      console.log("Conexion con la base de datos establecida");
    } catch (error) {
      console.log("Error en la conexion de la base de datos");
      console.log(error);
    }
  }

  listen() {
    this.io.on("connection", (socket) => {
      console.log("cliente conectado", socket.id);
      socket.on("disconnect", () => {
        console.log("cliente desconectado", socket.id);
      });
    });

    this.server.listen(this.port, () => {
      console.log(`server corriendo en el puerto: ${this.port}`);
    });
  }

    listen() {

        this.io.on('connection', (socket) => {
            console.log('cliente conectado', socket.id)

            socket.on('disconnect', () => {
                console.log('cliente desconectado', socket.id)
            })

            socket.on('message', (payload) => {
                console.log('mensaje:', payload)
                // this.io.emit('mensaje', payload)
            })

        })

        this.server.listen(this.port, () => {
            console.log(`server corriendo en el puerto: ${this.port}`)
        })
    }

    routes() {
        this.app.use(paths.users, require('../routes/user.routes'))
        this.app.use(paths.traduccionTextText, require('../routes/translateTextText.routes'))
        this.app.use(paths.auth, require('../routes/auth.routes'))
        this.app.use(paths.payments, require('../routes/payments.routes'))
        this.app.use(paths.lenguas, require('../routes/lenguas.routes'))
        this.app.use(paths.bitacora, require('../routes/bitacora.routes'))
        this.app.use(paths.empresa, require('../routes/empresa.routes'))
        this.app.use(paths.chat, require('../routes/chat.routes'))
        this.app.use(paths.plan_suscripcion, require('../routes/plan_suscripcion.routes'))
        this.app.use(paths.reporte, require("../routes/reporte.routes"));
        //? ruta a eliminar:
        //this.app.use(paths.audio, require('../routes/audio_pruebas.routes'))
    }
  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static("public"));
    this.app.use(
      fileupload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

}

module.exports = Server;
