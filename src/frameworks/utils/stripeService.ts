import Stripe from "stripe";
import { STRIPE_ENDPOINT_SECRET, STRIPE_SECRET_KEY } from "../constants/env";
import { IStripe } from "../../use-cases/interfaces/users/IStripe";

const stripe = new Stripe(STRIPE_SECRET_KEY);
const endpointSecret = STRIPE_ENDPOINT_SECRET;

export default class StripePayment implements IStripe {
  async makePayment(amount: number, service: string) {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: service,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // success_url: `http://localhost:8000/success`,
      success_url: `https://workzpro.vercel.app/success`,
      cancel_url: `http://localhost:8000/cancel`,
    });
    if (session.url) {
      return session.url;
    } else {
      throw new Error("Failed to create Stripe session.");
    }
  }
  async verifySucessOfWebhook(req: any): Promise<any> {
    let event = req.body;
    // console.log("---verifySucessOfWebhook---event---", event);
    if (endpointSecret) {
      const sig: any = req.headers["stripe-signature"];
      try {
        const payloadString = JSON.stringify(req.body, null, 2);
        const paymentIntentId = req.body?.data?.object?.payment_intent;
        // console.log(paymentIntentId, "paymentn inteten");
        const header = stripe.webhooks.generateTestHeaderString({
          payload: payloadString,
          secret: endpointSecret,
        });
        event = stripe.webhooks.constructEvent(
          payloadString,
          header,
          endpointSecret
        );

        if (paymentIntentId) {
          //   console.log("pymnt intnt");
          const paymentIntentResponse = await stripe.paymentIntents.retrieve(
            paymentIntentId
          );
          const paymentIntent = paymentIntentResponse;
          if (paymentIntentResponse.latest_charge) {
            const chargeId = paymentIntentResponse.latest_charge;
            // console.log(chargeId, "koooooooooo");
            req.app.locals.chargeId = chargeId;
          } else {
            return null;
          }
        }
      } catch (err) {
        console.log("errrrr", err);
        throw err;
      }
    }

    console.log(event.type);
    if (event.type == "checkout.session.completed") {
      return true;
    } else {
      return false;
    }
  }
}
