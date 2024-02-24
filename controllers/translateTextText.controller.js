const OpenAI = require('openai')

const traducirTextoTextoPost = async (req, res) => {
    /*
!        el JSON debe enviarse asi:
    {
    "idiomaOrigen":"Spanish",
    "idiomaATraducir":"German",
    "mensajeATraducir":"hola como estas me llamo gino"
    }

    ?tomar en cuenta que idiomaOrigen y idiomaATraducir deben estar en ingles
    */
    try {
        const openai = new OpenAI({
            apiKey: process.env.API_OPENAI,
        });

        const { idiomaOrigen, idiomaATraducir, mensajeATraducir } = req.body
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    "role": "system",
                    "content": `You will be provided with a sentence in ${idiomaOrigen}, and your task is to translate it into ${idiomaATraducir}.`
                },
                {
                    "role": "user",
                    "content": mensajeATraducir
                }
            ],
            temperature: 0.7,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        res.json({
            
            modelo:response.model,
            prompt_tokens:response.usage.prompt_tokens,
            completion_tokens:response.usage.completion_tokens,
            total_tokens:response.usage.total_tokens,
            mensajeTraducido: response.choices[0].message.content,
            mensajeOriginal:mensajeATraducir,
            idiomaOrigen,
            idiomaATraducir
        })
    } catch (error) {
        console.log('error en la conexion a OpenAI', error)
        res.status(500).json({
            error: 'error en la conexion a OpenAI'
        })
    }

}

module.exports = { traducirTextoTextoPost }

