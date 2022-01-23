
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const stripe = require("stripe")(functions.config().stripe.secret_key);
const cors = require('cors')({origin: true});

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send({"data": "Hello from Firebase!"});
});

exports.createStripeCheckout = functions.https.onCall(async (data, context)=>{
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: 'http://www.facebook.com',
        cancel_url: 'http://www.facebook.com',
        line_items: [
            {
                quantity: 1,
                price_data: {
                    currency: 'usd',
                    unit_amount: (49) * 100,
                    product_data: {
                        name: 'Web3Careers job post'
                    }
                }
            }
        ]
    })
    return {
        id: session.id
    }
})


exports.createSetupIntent = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () =>{
        const data = await stripe.setupIntents.create({
        });
        response.status(200).send(data);
    })
})

exports.createPaymentIntent = functions.https.onRequest(async (request, response) => {
    cors(request, response, async () =>{
        const data = await stripe.paymentIntents.create({
            amount: (49) * 100,
            currency: 'usd',
            payment_method_types: ['card'],
            payment_method: request.body.payment_id,
            receipt_email: request.body.email
        });
        response.status(200).send(data);
    })
})

exports.createCharge = functions.https.onRequest(async (request, response) => {
  const data = await stripe.paymentIntents.create({
    amount: request.body.amount,
    customer: request.body.customer_id,
    payment_method: request.body.payment_id,
    currency: 'CAD',
    confirm: true
  });
  response.send(data);
})
