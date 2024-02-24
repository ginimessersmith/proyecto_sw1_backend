const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const stripe = require('stripe')(process.env.STRIPE_KEY)
const Plan_suscripcion = require("../models/plan_suscripcion.models");
const Suscripcion = require("../models/suscripcion.models");


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_GOOGLE,
        pass: process.env.PASS_GOOGLE,
    },
})
const axios = require('axios');
const Empresa = require("../models/empresa.models");
const Usuario = require('../models/user.models');

const plan_suscripcionPost = async (req, res) => {
    const { nombre_plan,
        descripcion,
        precio_por_usuario,
        periodo
    } = req.body

    try {

        const nuevoPlan = await Plan_suscripcion.create({
            nombre_plan,
            descripcion,
            precio_por_usuario,
            periodo
        })

        res.json({ nuevoPlan })


    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: 'Error al crear un plan de suscripcion'
        })

    }
}

const plan_suscripcionPut = async (req, res) => {
    const { nombre_plan,
        descripcion,
        precio_por_usuario,
        periodo
    } = req.body

    const { uid_plan } = req.params

    try {

        const unPlan = await Plan_suscripcion.findByPk(uid_plan)

        if (unPlan) {

            if (nombre_plan &&
                nombre_plan != undefined &&
                nombre_plan != '') {

                unPlan.nombre_plan = nombre_plan
            }

            if (descripcion &&
                descripcion != undefined &&
                descripcion != '') {

                unPlan.descripcion = descripcion
            }

            if (precio_por_usuario &&
                precio_por_usuario != undefined &&
                precio_por_usuario != '') {

                unPlan.precio_por_usuario = precio_por_usuario
            }

            if (periodo &&
                periodo != undefined &&
                periodo != '') {

                unPlan.periodo = periodo
            }

            await unPlan.save()

            return res.json({
                mensaje: 'Plan actualizado',
                unPlan
            })

        } else {
            return res.status(400).json({
                mensaje: 'Erro el plan de suscripcion no existe'
            })
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: 'Error al actualizar un plan de suscripcion'
        })
    }
}

const suscripcion_empresa = async (req, res) => {
    const { uid_empresa,
        uid_plan,
        cantidad_clientes } = req.body
    try {
        const unaEmpresa = await Empresa.findByPk(uid_empresa)
        const unPlan = await Plan_suscripcion.findByPk(uid_plan)

        if (unaEmpresa && unPlan) {
            const total_pagar = unPlan.precio_por_usuario * cantidad_clientes
            const line_items = [
                {
                    price_data: {
                        product_data: {
                            name: `${unPlan.nombre_plan}`,
                            description: `${unPlan.descripcion}, la cantidad de usuarios para su plan es: ${cantidad_clientes}`
                        },
                        currency: 'usd',
                        unit_amount: `${total_pagar * 100}`
                        //?unit_amount: 2000//? 20$
                    },
                    quantity: 1
                },

            ]

            const pago = await payment(line_items)

            unaEmpresa.estado = true
            unaEmpresa.cantidad_usuarios = unaEmpresa.cantidad_usuarios + cantidad_clientes

            let fechaActual = new Date()
            fechaActual.setMilliseconds(0)
            const fecha_inicio = formatearFecha(fechaActual)
            const fecha_fin = calcularFechaFin(fecha_inicio, unPlan.periodo)

            const contenido = `
            Hola ${unaEmpresa.nombre_empresa}, Usted a adquirido una suscripcion en nuestra plataforma.
            Los detalles son:

            Nombre del Plan: ${unPlan.nombre_plan}
            Descripcion: ${unPlan.descripcion}
            Periodo: ${unPlan.periodo}
            Precio por Usuario: ${unPlan.precio_por_usuario}$
            Total pagado : ${total_pagar}$
            Cantidad de usuarios habilitados: ${cantidad_clientes}
            Fecha de Inicio: ${fecha_inicio}
            
            Su plan caduca la siguiente fecha: ${fecha_fin}

            Los clientes deberan actualizar sus cuentas, incluyendo el idioma que hablen ya que por defecto el idioma es ingles.

            Todos los clientes de su empresa podran iniciar sesion de la siguiente manera:
            
            Correo electronico por defecto: (numero) concatenado el correo de la empresa, donde el numero empieza en 1 hasta la cantidad
            de usuarios habilidado, 
            Ejemplo: 1correoEmpresa@gmail.com, 2correoEmpresa@gmail.com, etc

            La contraseña por defecto es: abc123
            `
            const correo = await enviarCorreo(unaEmpresa.correo_electronico, contenido)

            const nuevaSuscripcion = await Suscripcion.create({
                estado: true,
                fecha_inicio,
                fecha_fin,
                uid_plan_suscripcion: unPlan.uid,
                uid_empresa: unaEmpresa.uid,
                total_pagado: total_pagar
            })

            let num = 1
            for (num; num <= cantidad_clientes; num++) {
                const salt = bcrypt.genSaltSync()
                const encryptPassword = bcrypt.hashSync('abc123', salt)
                const email = `${num}${unaEmpresa.correo_electronico}`
                const nuevoUsuario = await Usuario.create({
                    fullname: unaEmpresa.nombre_empresa,
                    correo_electronico: email,
                    password_user: encryptPassword,
                    rol_user: 'CLIENTE',
                    uid_empresa: unaEmpresa.uid,
                    uid_lenguas_iso: '7a80194f-e03b-4b2e-a589-2ebfc008b245',
                    estado: true
                })
            }


            await unaEmpresa.save()

            return res.json({
                unaEmpresa,
                pago,
                correo,
                nuevaSuscripcion
            })

        } else {
            return res.status(400).json({
                mensaje: 'Error no existe la empresa o plan de suscripcion'
            })
        }


    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: 'Error al suscribir una empresa'
        })
    }
}
const payment = async (line_items) => {
    const pago = await stripe.checkout.sessions.create({
        line_items: line_items,
        mode: 'payment',
        success_url: process.env.STRIPE_SUCCESS_URL,
        cancel_url: process.env.STRIPE_CANCEL_URL,
    })
    return pago
}

const enviarCorreo = async (destinatario, contenidoSuscripcion) => {
    try {
        const contenido = contenidoSuscripcion

        const asunto = `Plan de Suscripcion`
        const mailOptions = {
            from: process.env.EMAIL_GOOGLE,
            to: destinatario,
            subject: asunto,
            text: contenido,
        }

        const info = await transporter.sendMail(mailOptions)
        console.log('correo enviado con exito')
        return {
            success: true,
            status: 200,
            mensaje: 'Correo electrónico enviado con éxito',
            info,
        };

    } catch (error) {
        console.log(error)
        return {
            success: false,
            status: 404,
            mensaje: 'No se pudo enviar el correo electrónico',
            error: error.message,
        }
    }
}

const formatearFecha = (fecha) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
    return fecha.toLocaleDateString('en-US', options).replace(/\//g, '-')
}

const calcularFechaFin = (fechaInicio, periodicidad) => {
    const fechaFin = new Date(fechaInicio)


    switch (periodicidad.toLowerCase()) {
        case '12 meses':
            fechaFin.setFullYear(fechaFin.getMonth() + 12)
            break
        case '6 meses':
            fechaFin.setMonth(fechaFin.getMonth() + 6)
            break
        case '3 meses':
            fechaFin.setMonth(fechaFin.getMonth() + 3)
            break
        case '1 mes':
            fechaFin.setMonth(fechaFin.getMonth() + 1)
            break
        default:

            break
    }

    return formatearFecha(fechaFin)
}

const lista_suscripcion = async (req, res) => {
    const { uid_empresa } = req.params

    try {

        const unaEmpresa = await Empresa.findByPk(uid_empresa)
        const lista_suscripcion = await Suscripcion.findAll({ where: { uid_empresa } })

        const filtrar = []

        for (let suscripcion of lista_suscripcion) {
            const { uid_plan_suscripcion } = suscripcion
            const unPlan = await Plan_suscripcion.findByPk(uid_plan_suscripcion)

            const json = {
                suscripcion_uid: suscripcion.uid,
                suscripcion_estado: suscripcion.estado,
                suscripcion_fecha_inicio: suscripcion.fecha_inicio,
                suscripcion_fecha_fin: suscripcion.fecha_fin,
                suscripcion_total_pagado: suscripcion.total_pagado,
                nombre_plan: unPlan.unPlan,
                descripcion_plan: unPlan.descripcion,
                periodo_plan: unPlan.periodo,
                precio_por_usuario_plan: unPlan.precio_por_usuario,

            }

            filtrar.push(json)

        }

        res.json({
            nombre_empresa: unaEmpresa.nombre_empresa,
            correo_electronico: unaEmpresa.correo_electronico,
            lista_suscripcion: filtrar
        })

    } catch (error) {
        console.log(error)
        res.status(400).json({
            mensaje: 'Error al obtener la lista de las suscripciones de una empresa'
        })
    }
}

module.exports = {
    plan_suscripcionPost,
    plan_suscripcionPut,
    suscripcion_empresa,
    lista_suscripcion
}