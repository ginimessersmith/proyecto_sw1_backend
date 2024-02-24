const stripe = require('stripe')
const stripeInstance  = stripe('sk_test_51O7BNFL4JynR3pGcI78DUOVfBblTZ8UwKOnch8G1gZnwRenjbAauobr9AFALQvhAiRsFHXU1ktKcT2b8lTWRU2Jg00li1s2ylH');



const createSession =  async (req, res) => {
    const session = await stripeInstance.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'T-shirt',
                        description: 'Comfortable cotton t-shirt',
                    },
                    unit_amount: 2000,
                },
                quantity: 1,
            }
        ],
        mode: 'payment',
        success_url: 'http://127.0.0.1:8080/api/payments/success',
        cancel_url: 'http://127.0.0.1:8080/api/payments/fail'
    })

    return res.json(session) 

}
const success =  (req, res) => res.send('success')
const fail =  (req, res) => res.send('fail')

module.exports = { createSession, success, fail }