
const fs = require('fs')
const path = require('path')
const OpenAI = require('openai')
const axios = require('axios')
const cloudinary = require("cloudinary").v2
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const audioPost = async (req, res) => {

    try {

        if (req.files && Object.keys(req.files).length !== 0 && req.files.archivo) {

            console.log('audio: ', req.files.archivo)

            const { tempFilePath,name } = req.files.archivo
            const cloud = await cloudinary.uploader.upload(tempFilePath, {
                folder: 'traductor_ia',
                resource_type: 'auto',
                type: 'upload',
            })

            const publicId = cloud.public_id
            const separar = publicId.split('/')
            const nombreCarpeta = separar[0]
            const nombreArchivo = separar[1]
            //? transcripcion de openAI:
            
            //* Descargar el archivo desde la URL de Cloudinary y guardarlo en public/assets
            const response = await axios.get(cloud.secure_url, { responseType: 'arraybuffer' })
            const audioBuffer = Buffer.from(response.data)
           
            const fileExtension = path.extname(name)
            const localFileName = `${nombreArchivo}${fileExtension}`
            const localFilePath = path.join(__dirname, '..', 'public', 'assets', localFileName);
            fs.writeFileSync(localFilePath, audioBuffer)

            // res.sendFile(localFilePath)
            const openai = new OpenAI({
                apiKey: process.env.API_OPENAI,
            })
            
            const transcription = await openai.audio.transcriptions.create({
                file: fs.createReadStream(path.join(__dirname, '..', 'public', 'assets', `${nombreArchivo}.mp3`)),
                model: 'whisper-1',
                //language:'de'
            
            });
            
            // console.log(transcription.text);
            // console.log(transcription);
            // console.log('CLOUD: ', cloud)
            
            res.json({
                cloud,
                nombreArchivo,
                nombreCarpeta,
                transcription
            })

        } else {
            res.status(400).json({ mensaje: 'no viene un audio en la solicitud' })
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({ mensaje: 'error en audio post' })
    }

}


module.exports = { audioPost }