const fs = require('fs')
const path = require('path')
const OpenAI = require('openai')
const axios = require('axios')
const stream = require("stream");
const util = require("util");
const { sequelize } = require("../database/config");
const { Sequelize, QueryInterface } = require("sequelize");
const textToSpeech = require("@google-cloud/text-to-speech");

const cloudinary = require("cloudinary").v2
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const { traducirTextoTexto } = require("../helpers/traducirTextoTexto.helper")
const Chat = require("../models/chat.models")
const Usuario = require("../models/user.models")
const Messages = require("../models/messages.models")
const Lenguas_iso = require("../models/lenguas_iso.models");
const { db } = require('../firebase/firebaseConfig');



const chatPost = async (req, res) => {
    //? crear un chat
    const { id_socket,
        uid_usuario_emisor,
        uid_usuario_receptor } = req.body

    try {

        const nuevoChat = await Chat.create({
            id_socket,
            uid_usuario_emisor,
            uid_usuario_receptor
        })

        res.json(nuevoChat)

    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: 'Error al crear un chat'
        })
    }
}
const chatGet = async (req, res) => { }
const chatGetId = async (req, res) => { }
const chat_Por_Uid_Usuario = async (req, res) => {
    const { uid_usuario } = req.params
    try {
        const listaChatEmisor = await Chat.findAll({ where: { uid_usuario_emisor: uid_usuario, estado: true } })
        const listaChatReceptor = await Chat.findAll({ where: { uid_usuario_receptor: uid_usuario, estado: true } })
        const unUsuario = await Usuario.findByPk(uid_usuario)

        // const { uid_lenguas_iso: lengua_origen } = unUsuario
        // const { code_639: code_origen } = await Lenguas_iso.findByPk(lengua_origen)

        // const filtrarlistaChatEmisor = []
        // const filtrarlistaChatReceptor = []

        // for (let chat of listaChatEmisor) {
        //     const { uid, id_socket, uid_usuario_emisor, uid_usuario_receptor } = chat
        //     const emisor = await Usuario.findOne({ where: { uid: uid_usuario_emisor }, attributes: ['uid', 'fullname', 'correo_electronico'] })
        //     const receptor = await Usuario.findOne({ where: { uid: uid_usuario_receptor }, attributes: ['uid', 'fullname', 'correo_electronico'] })
        //     const listaMensaje = await Messages.findAll({ where: { uid_chat: uid, code_639: code_origen } })

        //     const filtrar = []

        //     for (let mensaje of listaMensaje) {

        //         const { uid_usuario } = mensaje
        //         const unUser = await Usuario.findByPk(uid_usuario)

        //         const json = {
        //             uid_mensaje: mensaje.uid,
        //             uid_chat: mensaje.uid_chat,
        //             uid_usuario,
        //             nombre_usuario: unUser.fullname,
        //             mensaje: mensaje.mensaje,
        //             audio_url: mensaje.audio_url,
        //             code_639: mensaje.code_639
        //         }

        //         filtrar.push(json)

        //     }

        //     const json = {
        //         uid,
        //         id_socket,
        //         emisor,
        //         receptor,
        //         listaMensaje: filtrar
        //     }
        //     filtrarlistaChatEmisor.push(json)
        // }

        // for (let chat of listaChatReceptor) {
        //     const { uid, id_socket, uid_usuario_emisor, uid_usuario_receptor } = chat
        //     const emisor = await Usuario.findOne({ where: { uid: uid_usuario_emisor }, attributes: ['uid', 'fullname', 'correo_electronico'] })
        //     const receptor = await Usuario.findOne({ where: { uid: uid_usuario_receptor }, attributes: ['uid', 'fullname', 'correo_electronico'] })
        //     const listaMensaje = await Messages.findAll({ where: { uid_chat: uid, code_639: code_origen } })

        //     const filtrar = []

        //     for (let mensaje of listaMensaje) {

        //         const { uid_usuario } = mensaje
        //         const unUser = await Usuario.findByPk(uid_usuario)

        //         const json = {
        //             uid_mensaje: mensaje.uid,
        //             uid_chat: mensaje.uid_chat,
        //             uid_usuario,
        //             nombre_usuario: unUser.fullname,
        //             mensaje: mensaje.mensaje,
        //             audio_url: mensaje.audio_url,
        //             code_639: mensaje.code_639
        //         }

        //         filtrar.push(json)

        //     }

        //     const json = {
        //         uid,
        //         id_socket,
        //         emisor,
        //         receptor,
        //         listaMensaje: filtrar
        //     }

        //     filtrarlistaChatReceptor.push(json)
        // }
        const filtrar = []

        for (let chat of listaChatEmisor) {
            filtrar.push(chat)
        }

        for (let chat of listaChatReceptor) {
            filtrar.push(chat)
        }

        res.json({
            listaChat: filtrar
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: 'Error al obtener los chat por usuario'
        })
    }
}

const crear_mensaje_agregar_al_chat = async (req, res) => {
    try {
        const { mensaje, uid_chat, uid_usuario } = req.body
        const unChat = await Chat.findByPk(uid_chat)
        if (unChat) {

            const { uid_usuario_emisor, uid_usuario_receptor } = unChat

            if (uid_usuario == uid_usuario_emisor) {//no
                const emisor = await Usuario.findByPk(uid_usuario_emisor)
                const receptor = await Usuario.findByPk(uid_usuario_receptor)

                const { uid_lenguas_iso: uid_lengua_emisor } = emisor
                const { uid_lenguas_iso: uid_lengua_receptor } = receptor

                const lengua_emisor = await Lenguas_iso.findByPk(uid_lengua_emisor)
                const lengua_receptor = await Lenguas_iso.findByPk(uid_lengua_receptor)

                const { code_639: code_emisor } = lengua_emisor
                const { code_639: code_receptor } = lengua_receptor

                const idiomaOrigen = buscar_idioma_traducir_ingles(code_emisor)
                const idiomaTraducir = buscar_idioma_traducir_ingles(code_receptor)

                const traductor = await traducirTextoTexto(idiomaOrigen, idiomaTraducir, mensaje)

                const nuevoMensaje = await Messages.create({
                    mensaje: traductor.mensajeOriginal,
                    uid_chat,
                    uid_usuario,
                    code_639: code_emisor,

                })

                const nuevoMensajeTraducido = await Messages.create({
                    mensaje: traductor.mensajeTraducido,
                    uid_chat,
                    uid_usuario,
                    code_639: code_receptor
                })
                const mensaje1 = await Messages.findByPk(nuevoMensaje.uid)
                const mensaje2 = await Messages.findByPk(nuevoMensajeTraducido.uid)
                return res.json({
                    nuevoMensaje: mensaje1,
                    nuevoMensajeTraducido: mensaje2
                })
            } else {

                const emisor = await Usuario.findByPk(uid_usuario_emisor)
                const receptor = await Usuario.findByPk(uid_usuario_receptor)

                const { uid_lenguas_iso: uid_lengua_emisor } = emisor
                const { uid_lenguas_iso: uid_lengua_receptor } = receptor

                const lengua_emisor = await Lenguas_iso.findByPk(uid_lengua_emisor)
                const lengua_receptor = await Lenguas_iso.findByPk(uid_lengua_receptor)

                const { code_639: code_emisor } = lengua_emisor
                const { code_639: code_receptor } = lengua_receptor

                const idiomaOrigen = buscar_idioma_traducir_ingles(code_receptor)//fr
                const idiomaTraducir = buscar_idioma_traducir_ingles(code_emisor)//sp

                const traductor = await traducirTextoTexto(idiomaOrigen, idiomaTraducir, mensaje)

                const nuevoMensaje = await Messages.create({
                    mensaje: traductor.mensajeOriginal,
                    uid_chat,
                    uid_usuario,
                    code_639: code_receptor
                })

                const nuevoMensajeTraducido = await Messages.create({
                    mensaje: traductor.mensajeTraducido,
                    uid_chat,
                    uid_usuario,
                    code_639: code_emisor
                })

                return res.json({
                    nuevoMensaje,
                    nuevoMensajeTraducido
                })

            }

        } else {
            return res.status(400).json({ mensaje: 'Error, el chat no existe' })
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: 'Error al crear un mensaje y agregarlo al chat'
        })
    }
}

const buscar_idioma_traducir_ingles = (code_639) => {
    const idiomas = [
        { code: 'es', name: 'Spanish' },
        { code: 'en', name: 'English' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'zh', name: 'Mandarin' },
        { code: 'ru', name: 'Russian' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'tr', name: 'Turkish' },
        { code: 'ko', name: 'Korean' },
        { code: 'ar', name: 'Arabic' },
        { code: 'nl', name: 'Dutch' },
        { code: 'pl', name: 'Polish' },
        { code: 'it', name: 'Italian' },
        { code: 'hi', name: 'Hindi' },
        { code: 'ja', name: 'Japanese' },
    ];

    const idiomaEncontrado = idiomas.find(idioma => idioma.code === code_639)
    const idiomaIngles = idiomaEncontrado ? idiomaEncontrado.name : 'Unknown'

    return idiomaIngles
}

const enviar_audio = async (req, res) => {
    try {
        const { mensaje, uid_chat, uid_usuario } = req.body
        const unChat = await Chat.findByPk(uid_chat)

        if (unChat) {
            const { uid_usuario_emisor, uid_usuario_receptor } = unChat
            if (req.files && Object.keys(req.files).length !== 0 && req.files.archivo) {

                const usuario = await Usuario.findByPk(uid_usuario)
                const language_iso = await Lenguas_iso.findByPk(usuario.uid_lenguas_iso)
                const emisor = await Usuario.findByPk(uid_usuario_emisor)
                const receptor = await Usuario.findByPk(uid_usuario_receptor)

                const { uid_lenguas_iso: uid_lengua_emisor } = emisor
                const { uid_lenguas_iso: uid_lengua_receptor } = receptor

                const lengua_emisor = await Lenguas_iso.findByPk(uid_lengua_emisor)
                const lengua_receptor = await Lenguas_iso.findByPk(uid_lengua_receptor)

                const { code_639: code_emisor } = lengua_emisor
                const { code_639: code_receptor } = lengua_receptor



                if (uid_usuario == uid_usuario_emisor) {
                    const { tempFilePath, name } = req.files.archivo
                    const { secure_url: secure_url_original, public_id } = await cloudinary.uploader.upload(tempFilePath, {
                        folder: 'traductor_ia',
                        resource_type: 'auto',
                        type: 'upload',
                    })

                    const publicId = public_id
                    const separar = publicId.split('/')
                    const nombreCarpeta = separar[0]
                    const nombreArchivo = separar[1]
                    //? transcripcion de openAI:

                    //* Descargar el archivo desde la URL de Cloudinary y guardarlo en public/assets
                    const response = await axios.get(secure_url_original, { responseType: 'arraybuffer' })
                    const audioBuffer = Buffer.from(response.data)

                    const fileExtension = path.extname(name)
                    const localFileName = `${nombreArchivo}${fileExtension}`
                    const localFilePath = path.join(__dirname, '..', 'public', 'assets', localFileName);
                    fs.writeFileSync(localFilePath, audioBuffer)

                    //* Transcripcion del audio con openAI
                    const openai = new OpenAI({
                        apiKey: process.env.API_OPENAI,
                    })

                    const transcription = await openai.audio.transcriptions.create({
                        file: fs.createReadStream(path.join(__dirname, '..', 'public', 'assets', `${nombreArchivo}.mp3`)),
                        model: 'whisper-1',
                        language: `${code_emisor}`

                    })

                    //* traduccion de la transcipcion del audio 
                    const languageCode = buscar_LanguageCode(code_receptor)
                    const text = transcription.text

                    const textoTraducido = await translate(text, languageCode);

                    console.log("textToSynthesize:", textoTraducido);
                    //* creacion del nuevo audio traducido
                    const client = new textToSpeech.TextToSpeechClient();
                    const request = {
                        input: { text: textoTraducido },
                        voice: { languageCode, ssmlGender: "NEUTRAL" },
                        audioConfig: { audioEncoding: "MP3" },
                    };

                    const [responseGoogle] = await client.synthesizeSpeech(request);

                    // Genera un nombre de archivo único basado en el timestamp
                    const fileName = `${Date.now()}.mp3`;

                    // Ruta completa del archivo
                    const filePath = path.join(__dirname, "..", "public", "audio", fileName)

                    // Escribe el contenido binario del audio en el archivo
                    const writeFile = util.promisify(fs.writeFile);
                    await writeFile(filePath, responseGoogle.audioContent, "binary")
                    console.log(`Audio content written to file: ${filePath}`)

                    //* subida del audio traducido a cloudinary
                    const { secure_url: secure_url_traducido } = await cloudinary.uploader.upload(filePath, {
                        folder: 'traductor_ia',
                        resource_type: 'auto',
                        type: 'upload',
                    })

                    fs.unlinkSync(localFilePath)
                    fs.unlinkSync(filePath)
                    const nuevoMensaje = await Messages.create({
                        mensaje: '$',
                        uid_chat,
                        uid_usuario,
                        audio_url: secure_url_original,
                        code_639: code_emisor
                    })

                    const nuevoMensajeTraducido = await Messages.create({
                        mensaje: '$',
                        uid_chat,
                        uid_usuario,
                        audio_url: secure_url_traducido,
                        code_639: code_receptor
                    })

                    return res.json({
                        nuevoMensaje,
                        nuevoMensajeTraducido
                    })

                } else {

                    const { tempFilePath, name } = req.files.archivo
                    const { secure_url: secure_url_original, public_id } = await cloudinary.uploader.upload(tempFilePath, {
                        folder: 'traductor_ia',
                        resource_type: 'auto',
                        type: 'upload',
                    })

                    const publicId = public_id
                    const separar = publicId.split('/')
                    const nombreCarpeta = separar[0]
                    const nombreArchivo = separar[1]
                    //? transcripcion de openAI:

                    //* Descargar el archivo desde la URL de Cloudinary y guardarlo en public/assets
                    const response = await axios.get(secure_url_original, { responseType: 'arraybuffer' })
                    const audioBuffer = Buffer.from(response.data)

                    const fileExtension = path.extname(name)
                    const localFileName = `${nombreArchivo}${fileExtension}`
                    const localFilePath = path.join(__dirname, '..', 'public', 'assets', localFileName);
                    fs.writeFileSync(localFilePath, audioBuffer)

                    //* Transcripcion del audio con openAI
                    const openai = new OpenAI({
                        apiKey: process.env.API_OPENAI,
                    })

                    const transcription = await openai.audio.transcriptions.create({
                        file: fs.createReadStream(path.join(__dirname, '..', 'public', 'assets', `${nombreArchivo}.mp3`)),
                        model: 'whisper-1',
                        language: `${code_receptor}`

                    })

                    //* traduccion de la transcipcion del audio 
                    const languageCode = buscar_LanguageCode(code_emisor)
                    const text = transcription.text

                    const textoTraducido = await translate(text, languageCode);

                    console.log("textToSynthesize:", textoTraducido);
                    //* creacion del nuevo audio traducido
                    const client = new textToSpeech.TextToSpeechClient();
                    const request = {
                        input: { text: textoTraducido },
                        voice: { languageCode, ssmlGender: "NEUTRAL" },
                        audioConfig: { audioEncoding: "MP3" },
                    };

                    const [responseGoogle] = await client.synthesizeSpeech(request);

                    // Genera un nombre de archivo único basado en el timestamp
                    const fileName = `${Date.now()}.mp3`;

                    // Ruta completa del archivo
                    const filePath = path.join(__dirname, "..", "public", "audio", fileName)

                    // Escribe el contenido binario del audio en el archivo
                    const writeFile = util.promisify(fs.writeFile);
                    await writeFile(filePath, responseGoogle.audioContent, "binary")
                    console.log(`Audio content written to file: ${filePath}`)

                    //* subida del audio traducido a cloudinary
                    const { secure_url: secure_url_traducido } = await cloudinary.uploader.upload(filePath, {
                        folder: 'traductor_ia',
                        resource_type: 'auto',
                        type: 'upload',
                    })
                    const nuevoMensaje = await Messages.create({
                        mensaje: '$',
                        uid_chat,
                        uid_usuario,
                        audio_url: secure_url_original,
                        code_639: code_receptor
                    })

                    const nuevoMensajeTraducido = await Messages.create({
                        mensaje: '$',
                        uid_chat,
                        uid_usuario,
                        audio_url: secure_url_traducido,
                        code_639: code_emisor
                    })

                    return res.json({
                        nuevoMensaje,
                        nuevoMensajeTraducido
                    })
                }



            } else {
                return res.status(400).json({ mensaje: 'no viene un audio en la solicitud' })
            }

        } else {
            return res.status(400).json({ mensaje: 'el chat no existe' })
        }


    } catch (error) {
        console.log(error)
        res.status(400).json({ mensaje: 'Error al enviar un audio ' })
    }
}

const enviar_audio_firebase = async (req, res) => {
    try {
        // const querySnapShot = await db.collection('users').get()
        // const data = querySnapShot.docs[0].data()
        // res.json(data)
        //Guardar en firebase
        // await db.collection('users').add({
        //     code_iso:'helo',
        //     name:'gino1',
        //     url_audio_original:'jalskdf',
        //     url_audio_traducido:'jalskdf',
        // })

        //res.json({ mensaje: 'creado con exito' })
        const { mensaje, uid_chat, uid_usuario } = req.body
        const unChat = await Chat.findByPk(uid_chat)

        if (unChat) {
            const { uid_usuario_emisor, uid_usuario_receptor } = unChat
            if (req.files && Object.keys(req.files).length !== 0 && req.files.archivo) {

                const usuario = await Usuario.findByPk(uid_usuario)
                const language_iso = await Lenguas_iso.findByPk(usuario.uid_lenguas_iso)
                const emisor = await Usuario.findByPk(uid_usuario_emisor)
                const receptor = await Usuario.findByPk(uid_usuario_receptor)

                const { uid_lenguas_iso: uid_lengua_emisor } = emisor
                const { uid_lenguas_iso: uid_lengua_receptor } = receptor

                const lengua_emisor = await Lenguas_iso.findByPk(uid_lengua_emisor)
                const lengua_receptor = await Lenguas_iso.findByPk(uid_lengua_receptor)

                const { code_639: code_emisor } = lengua_emisor
                const { code_639: code_receptor } = lengua_receptor



                if (uid_usuario == uid_usuario_emisor) {
                    const { tempFilePath, name } = req.files.archivo
                    const { secure_url: secure_url_original, public_id } = await cloudinary.uploader.upload(tempFilePath, {
                        folder: 'traductor_ia',
                        resource_type: 'auto',
                        type: 'upload',
                    })

                    const publicId = public_id
                    const separar = publicId.split('/')
                    const nombreCarpeta = separar[0]
                    const nombreArchivo = separar[1]
                    //? transcripcion de openAI:

                    //* Descargar el archivo desde la URL de Cloudinary y guardarlo en public/assets
                    const response = await axios.get(secure_url_original, { responseType: 'arraybuffer' })
                    const audioBuffer = Buffer.from(response.data)

                    const fileExtension = path.extname(name)
                    const localFileName = `${nombreArchivo}${fileExtension}`
                    const localFilePath = path.join(__dirname, '..', 'public', 'assets', localFileName);
                    fs.writeFileSync(localFilePath, audioBuffer)

                    //* Transcripcion del audio con openAI
                    const openai = new OpenAI({
                        apiKey: process.env.API_OPENAI,
                    })

                    const transcription = await openai.audio.transcriptions.create({
                        file: fs.createReadStream(path.join(__dirname, '..', 'public', 'assets', `${nombreArchivo}.mp3`)),
                        model: 'whisper-1',
                        language: `${code_emisor}`

                    })

                    //* traduccion de la transcipcion del audio 
                    const languageCode = buscar_LanguageCode(code_receptor)
                    const text = transcription.text

                    const textoTraducido = await translate(text, languageCode);

                    console.log("textToSynthesize:", textoTraducido);
                    //* creacion del nuevo audio traducido
                    const client = new textToSpeech.TextToSpeechClient();
                    const request = {
                        input: { text: textoTraducido },
                        voice: { languageCode, ssmlGender: "NEUTRAL" },
                        audioConfig: { audioEncoding: "MP3" },
                    };

                        const [responseGoogle] = await client.synthesizeSpeech(request);

                        // Genera un nombre de archivo único basado en el timestamp
                        const fileName = `${Date.now()}.mp3`;

                        // Ruta completa del archivo
                        const filePath = path.join(__dirname, "..", "public", "audio", fileName)

                        // Escribe el contenido binario del audio en el archivo
                        const writeFile = util.promisify(fs.writeFile);
                        await writeFile(filePath, responseGoogle.audioContent, "binary")
                        console.log(`Audio content written to file: ${filePath}`)

                        //* subida del audio traducido a cloudinary
                        const { secure_url: secure_url_traducido } = await cloudinary.uploader.upload(filePath, {
                            folder: 'traductor_ia',
                            resource_type: 'auto',
                            type: 'upload',
                        })

                    fs.unlinkSync(localFilePath)
                    fs.unlinkSync(filePath)
                    const firebase_message=await db.collection('messages').add({
                        uid_chat,
                        uid_usuario,
                        audio_url_original: secure_url_original,
                        code_emisor,
                        audio_url_traducido: secure_url_traducido,
                        code_receptor
                    })
                    const nuevoMensaje = await Messages.create({
                        mensaje: '$',
                        uid_chat,
                        uid_usuario,
                        audio_url: secure_url_original,
                        code_639: code_emisor
                    })

                    const nuevoMensajeTraducido = await Messages.create({
                        mensaje: '$',
                        uid_chat,
                        uid_usuario,
                        audio_url: secure_url_traducido,
                        code_639: code_receptor
                    })

                    return res.json({
                        nuevoMensaje,
                        nuevoMensajeTraducido,
                        firebase_message
                    })

                } else {

                    const { tempFilePath, name } = req.files.archivo
                    const { secure_url: secure_url_original, public_id } = await cloudinary.uploader.upload(tempFilePath, {
                        folder: 'traductor_ia',
                        resource_type: 'auto',
                        type: 'upload',
                    })

                    const publicId = public_id
                    const separar = publicId.split('/')
                    const nombreCarpeta = separar[0]
                    const nombreArchivo = separar[1]
                    //? transcripcion de openAI:

                    //* Descargar el archivo desde la URL de Cloudinary y guardarlo en public/assets
                    const response = await axios.get(secure_url_original, { responseType: 'arraybuffer' })
                    const audioBuffer = Buffer.from(response.data)

                    const fileExtension = path.extname(name)
                    const localFileName = `${nombreArchivo}${fileExtension}`
                    const localFilePath = path.join(__dirname, '..', 'public', 'assets', localFileName);
                    fs.writeFileSync(localFilePath, audioBuffer)

                    //* Transcripcion del audio con openAI
                    const openai = new OpenAI({
                        apiKey: process.env.API_OPENAI,
                    })

                    const transcription = await openai.audio.transcriptions.create({
                        file: fs.createReadStream(path.join(__dirname, '..', 'public', 'assets', `${nombreArchivo}.mp3`)),
                        model: 'whisper-1',
                        language: `${code_receptor}`

                    })

                    //* traduccion de la transcipcion del audio 
                    const languageCode = buscar_LanguageCode(code_emisor)
                    const text = transcription.text

                    const textoTraducido = await translate(text, languageCode);

                    console.log("textToSynthesize:", textoTraducido);
                    //* creacion del nuevo audio traducido
                    const client = new textToSpeech.TextToSpeechClient();
                    const request = {
                        input: { text: textoTraducido },
                        voice: { languageCode, ssmlGender: "NEUTRAL" },
                        audioConfig: { audioEncoding: "MP3" },
                    };

                    const [responseGoogle] = await client.synthesizeSpeech(request);

                    // Genera un nombre de archivo único basado en el timestamp
                    const fileName = `${Date.now()}.mp3`;

                    // Ruta completa del archivo
                    const filePath = path.join(__dirname, "..", "public", "audio", fileName)

                    // Escribe el contenido binario del audio en el archivo
                    const writeFile = util.promisify(fs.writeFile);
                    await writeFile(filePath, responseGoogle.audioContent, "binary")
                    console.log(`Audio content written to file: ${filePath}`)

                    //* subida del audio traducido a cloudinary
                    const { secure_url: secure_url_traducido } = await cloudinary.uploader.upload(filePath, {
                        folder: 'traductor_ia',
                        resource_type: 'auto',
                        type: 'upload',
                    })
                    const firebase_message=await db.collection('messages').add({
                        uid_chat,
                        uid_usuario,
                        audio_url_original: secure_url_original,
                        code_emisor,
                        audio_url_traducido: secure_url_traducido,
                        code_receptor
                    })
                    const nuevoMensaje = await Messages.create({
                        mensaje: '$',
                        uid_chat,
                        uid_usuario,
                        audio_url: secure_url_original,
                        code_639: code_receptor
                    })

                    const nuevoMensajeTraducido = await Messages.create({
                        mensaje: '$',
                        uid_chat,
                        uid_usuario,
                        audio_url: secure_url_traducido,
                        code_639: code_emisor
                    })

                    return res.json({
                        nuevoMensaje,
                        nuevoMensajeTraducido,
                        firebase_message
                    })
                }



            } else {
                return res.status(400).json({ mensaje: 'no viene un audio en la solicitud' })
            }

        } else {
            return res.status(400).json({ mensaje: 'el chat no existe' })
        }


    } catch (error) {
        console.log(error)
        res.status(400).json({ mensaje: 'Error al enviar un audio ' })
    }
}

const mis_mensajes_otro_usuario = async (req, res) => {
    try {
        const { uid_usuario, uid_usuario_destino } = req.body
        const filtrar = []

        const unChat = await Chat.findOne({
            where: {
                uid_usuario_emisor: uid_usuario,
                uid_usuario_receptor: uid_usuario_destino,
                estado: true
            }
        })
        const otroChat = await Chat.findOne({
            where: {
                uid_usuario_emisor: uid_usuario_destino,
                uid_usuario_receptor: uid_usuario,
                estado: true
            }
        })

        if (unChat) {
            const unUsuario = await Usuario.findByPk(uid_usuario)
            const { uid_lenguas_iso } = unUsuario
            const { code_639 } = await Lenguas_iso.findByPk(uid_lenguas_iso)

            const listaMensajes1 = await Messages.findAll({ where: { uid_usuario, code_639, uid_chat: unChat.uid, estado: true } })
            const listaMensajes2 = await Messages.findAll({ where: { uid_usuario: uid_usuario_destino, code_639, uid_chat: unChat.uid, estado: true } })

            for (let message of listaMensajes1) {
                const usuario = await Usuario.findByPk(message.uid_usuario)
                const json = {
                    uid: message.uid,
                    nombre_usuario: usuario.fullname,
                    mensaje: message.mensaje,
                    uid_chat: message.uid_chat,
                    uid_usuario: message.uid_usuario,
                    audio_url: message.audio_url,
                    code_639: message.code_639

                }
                filtrar.push(json)
            }

            for (let message of listaMensajes2) {
                const usuario = await Usuario.findByPk(message.uid_usuario)
                const json = {
                    uid: message.uid,
                    nombre_usuario: usuario.fullname,
                    mensaje: message.mensaje,
                    uid_chat: message.uid_chat,
                    uid_usuario: message.uid_usuario,
                    audio_url: message.audio_url,
                    code_639: message.code_639

                }
                filtrar.push(json)
            }

        }

        if (otroChat) {
            const unUsuario = await Usuario.findByPk(uid_usuario)
            const { uid_lenguas_iso } = unUsuario
            const { code_639 } = await Lenguas_iso.findByPk(uid_lenguas_iso)

            const listaMensajes1 = await Messages.findAll({ where: { uid_usuario, code_639, uid_chat: otroChat.uid, estado: true } })
            const listaMensajes2 = await Messages.findAll({ where: { uid_usuario: uid_usuario_destino, code_639, uid_chat: otroChat.uid, estado: true } })

            for (let message of listaMensajes1) {
                const usuario = await Usuario.findByPk(message.uid_usuario)
                const json = {
                    uid: message.uid,
                    nombre_usuario: usuario.fullname,
                    mensaje: message.mensaje,
                    uid_chat: message.uid_chat,
                    uid_usuario: message.uid_usuario,
                    audio_url: message.audio_url,
                    code_639: message.code_639

                }
                filtrar.push(json)
            }

            for (let message of listaMensajes2) {
                const usuario = await Usuario.findByPk(message.uid_usuario)
                const json = {
                    uid: message.uid,
                    nombre_usuario: usuario.fullname,
                    mensaje: message.mensaje,
                    uid_chat: message.uid_chat,
                    uid_usuario: message.uid_usuario,
                    audio_url: message.audio_url,
                    code_639: message.code_639

                }
                filtrar.push(json)
            }
        }

        res.json({
            listaMensajes: filtrar,

        })

    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: 'Error al obtener mis mensajes con otro usuario'
        })
    }
}
const buscar_LanguageCode = (code_639) => {
    const idiomas = [
        { code: 'es', name: 'es-ES' },
        { code: 'en', name: 'en-US' },
        { code: 'fr', name: 'fr-CH' },
        { code: 'de', name: 'de-DE' },
        { code: 'zh', name: 'zh-CN' },
        { code: 'ru', name: 'ru-RU' },
        { code: 'pt', name: 'pt-PT' },
        { code: 'tr', name: 'tr-TR' },
        { code: 'ko', name: 'ko' },
        { code: 'ar', name: 'ar-SA' },
        { code: 'nl', name: 'nl-NL' },
        { code: 'pl', name: 'pl-PL' },
        { code: 'it', name: 'it' },
        { code: 'hi', name: 'hi-IN' },
        { code: 'ja', name: 'ja-JP' },
    ];

    const LanguageEncontrado = idiomas.find(idioma => idioma.code === code_639)
    const language = LanguageEncontrado ? LanguageEncontrado.name : 'Unknown'

    return language
}

async function translate(text, languageCode) {
    const openai = new OpenAI({
        apiKey: process.env.API_OPENAI,
    })
    const chatCompletion = await openai.chat.completions.create({
        messages: [
            {
                role: "user",
                content: `Solo devolver el texto traducido a ${languageCode}: ${text}`,
            },
        ],
        model: "gpt-3.5-turbo",
    });

    return chatCompletion.choices[0].message.content;
}

const eliminar_chat = async (req, res) => {
    try {
        const { uid_chat } = req.params

        const unChat = await Chat.findByPk(uid_chat)

        if (unChat) {
            const listaMensajes = await Messages.findAll({ where: { uid_chat } })

            for (let unMensaje of listaMensajes) {
                const { uid } = unMensaje
                const mensajeEliminar = await Messages.findByPk(uid)
                mensajeEliminar.estado = false
                await mensajeEliminar.save()
            }

            unChat.estado = false
            await unChat.save()

            return res.json({
                mensaje: 'El chat fue eliminado con exito'
            })
        } else {
            return res.status(400).json({
                mensaje: 'No existe el chat que desea eliminar '
            })
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: 'Error al eliminar un chat'
        })
    }
}

const eliminar_un_mensaje = async (req, res) => {
    try {
        const { uid_mensaje } = req.params
        const unMensaje = await Messages.findByPk(uid_mensaje)
        if (unMensaje) {
            unMensaje.estado = false
            await unMensaje.save()

            return res.json({
                mensaje: 'El mensaje fue eliminado con exito'
            })

        } else {
            return res.status(400).json({
                mensaje: 'No existe el mensaje que desea eliminar '
            })
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: 'Error al eliminar un usuario'
        })
    }
}

const mensajes_del_chat = async (req, res) => {
    try {
        const { uid_chat, uid_usuario } = req.body
        const unChat = await Chat.findByPk(uid_chat)
        const unUsuario = await Usuario.findByPk(uid_usuario)
        const { uid_lenguas_iso } = unUsuario
        const { code_639 } = await Lenguas_iso.findByPk(uid_lenguas_iso)
        const filtrar = []
        if (unChat) {

            listaMensajes = await Messages.findAll({
                where: { uid_chat, code_639 },
                order: [['fecha', 'ASC'], ['hora', 'ASC']]
            })

            for (let mensaje of listaMensajes) {
                const { uid_usuario: uid } = mensaje
                const { fullname } = await Usuario.findByPk(uid)

                const json = {
                    uid: mensaje.uid,
                    uid_usuario: uid,
                    nombre_usuario: fullname,
                    mensaje: mensaje.mensaje,
                    audio_url: mensaje.audio_url,
                    code_639: mensaje.code_639,
                    estado: mensaje.estado,
                    fecha: mensaje.fecha,
                    hora: mensaje.hora

                }
                filtrar.push(json)
            }

            return res.json({
                listaMensajes: filtrar
            })
        } else {
            return res.status(400).json({
                mensaje: 'no existe el chat'
            })
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: 'Error al obtener los mensajes de un chat'
        })
    }
}

const chat_list_uid_usuario = async (req, res) => {
    const { uid } = req.params;

    try {
        const results = await sequelize.query(
            "SELECT *  FROM chat WHERE uid_usuario_emisor = :uid OR uid_usuario_receptor = :uid",
            {
                replacements: { uid },
                type: Sequelize.QueryTypes.SELECT,
            }
        );
        res.send(results);
    } catch (error) {
        console.log(error);
        res.status(400).json({
            mensaje: "Error al obtener chat list por user",
        });
    }
};
module.exports = {
    chatGet,
    chatGetId,
    chat_Por_Uid_Usuario,
    chatPost,
    crear_mensaje_agregar_al_chat,
    enviar_audio,
    mis_mensajes_otro_usuario,
    eliminar_chat,
    eliminar_un_mensaje,
    mensajes_del_chat,
    chat_list_uid_usuario,
    enviar_audio_firebase
}