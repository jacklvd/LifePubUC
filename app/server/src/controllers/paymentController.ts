import { Request, Response } from "express";
import Stripe from "stripe";
import User from "../models/userSchema";
import Item from "../models/itemSchema";
import Transaction from "../models/transactionSchema";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);


interface CartItem {
  _id: string;
  title: string;
  price: { amount: number };  // Matching your schema
  quantity: number;
  seller: string;  // This will be the seller ID
}

/****************
 * Connected Account Creation
 **************** */

const createStripeAccountLink = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ message: "No User Id" });
      return;
    }
    const user = await User.findById(userId);

    if (!user) {
      res.status(400).json({ message: "User does not exist" });
      return;
    }

    const { account } = req.body;
    // console.log(req.headers.origin);
    const accountLink = await stripe.accountLinks.create({
      account: account,
      return_url: `${process.env.FRONTEND_URL}/organization/home/${account}`,
      refresh_url: `${process.env.FRONTEND_URL}/organization/onboarding`,
      type: "account_onboarding",
    });

    res.json(accountLink);
  } catch (error: any) {
    console.error(
      "An error occurred when calling the Stripe API to create an account link:",
      error
    );
    res.status(500);
    res.send({ error: error.message });
  }
};

const createStripeAccount = async (req: Request, res: Response) => {
  const { userId } = req.body;
  if (!userId) {
    res.status(400).json({ message: "No User Id" });
    return;
  }
  const user = await User.findById(userId);
  console.log(user);
  if (!user) {
    res.status(400).json({ message: "User does not exist" });
    return;
  }

  if (user.stripeConnectAccountId) {
    res.status(200).json({
      account: user.stripeConnectAccountId,
    });
    return;
  }

  try {
    const account = await stripe.accounts.create({
      controller: {
        stripe_dashboard: {
          type: "none",
        },
      },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      country: "US",
    });

    await User.findByIdAndUpdate(userId, {
      stripeConnectAccountId: account.id,
      stripeConnectOnboardingComplete: false,
    });

    res.json({
      account: account.id,
    });
  } catch (error: any) {
    console.error(
      "An error occurred when calling the Stripe API to create an account",
      error
    );
    res.status(500);
    res.send({ error: error.message });
  }
};

/****************
 * Stripe Payment Intent
 **************** */

const createStripeCheckoutSession = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { cartItems, buyerId } = req.body;
  console.log("Here: ", buyerId);

  const buyer = await User.findById(buyerId);

  
  if (!buyer) {
    res.status(400).json({
      message: "No Buyer supplied",
      data: {},
    });
    return;
  }

  try {
    // Group cart items by seller
      const itemsBySeller: Record<string, CartItem[]> = {};


      for (const item of cartItems) {
        if (!itemsBySeller[item.seller]) {
          itemsBySeller[item.seller] = [];
        }
        itemsBySeller[item.seller].push(item);
      }

    // Create line items and transfers for each seller
    const lineItems = [];
    const transferData = [];
    
    for (const [sellerId, items] of Object.entries(itemsBySeller)) {
      const seller = await User.findById(sellerId);
      
      if (!seller || !seller.stripeConnectAccountId) {
        res.status(400).json({
          message: `Seller ${sellerId} is not properly set up to receive payments`,
        });
        return;
      }
      
      // Add line items for this seller
      for (const item of items) {
        lineItems.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.title,
           
            },
            unit_amount: Math.round(item.price.amount * 100), 
          },
          quantity: item.quantity,
        });
        
        const itemTotal = Math.round(item.price.amount * item.quantity * 100);
        const platformFee = Math.round(itemTotal * 0.1); 
        
        transferData.push({
          amount: itemTotal - platformFee,
          destination: seller.stripeConnectAccountId,
          description: `Payment for order items from ${seller.name || sellerId}`,
        });
      }
    }

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      payment_intent_data: {
        transfer_group: `ORDER-${buyerId}-${Date.now()}`,
      },
      mode: 'payment',
      ui_mode: 'embedded',
      metadata: {
        buyerId,
        sellerData: JSON.stringify(Object.keys(itemsBySeller)),
      },
      return_url: `${process.env.FRONTEND_URL}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    // await Order.create({
    //   checkoutSessionId: session.id,
    //   buyerId,
    //   transferData,
    //   status: 'pending',
    // });



    res.json({
      message: "Checkout session created",
      data: {
        clientSecret: session.client_secret,
        sessionId: session.id
      },
    });
  } catch (error: unknown) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ 
      message: "Error creating checkout session", 
      error: error || "" 
    });
  }
};

/****************
 * WEBHOOKS
 **************** */

const handleStripeWebhook = async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

  let event: Stripe.Event;

  try {
    // Verify the event came from Stripe
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      webhookSecret
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Extract metadata
      const buyerId = session.metadata?.buyerId;
      const sellerIds = JSON.parse(session.metadata?.sellerData || '[]');
      
      console.log('Payment succeeded for session:', session.id);
      
      // Here you would update your database to record the completed payment
      // And process transfers to sellers
      try {
        // Update order status
        // await Order.findOneAndUpdate(
        //   { checkoutSessionId: session.id },
        //   { status: 'completed', paymentIntentId: session.payment_intent }
        // );
        
        // For each seller, create a transfer
        if (session.payment_intent && typeof session.payment_intent === 'string') {
          // Retrieve payment intent to get the amount
          const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
          
          // Process transfers to each seller
          // This would pull transfer data from your database
          // const order = await Order.findOne({ checkoutSessionId: session.id });
          // if (order && order.transferData) {
          //   for (const transfer of order.transferData) {
          //     await stripe.transfers.create({
          //       amount: transfer.amount,
          //       currency: 'usd',
          //       destination: transfer.destination,
          //       source_transaction: paymentIntent.charges.data[0].id,
          //       description: transfer.description
          //     });
          //   }
          // }
          
          // Notify sellers about the sale (could be via email, push notification, etc.)
          // for (const sellerId of sellerIds) {
          //   // Add notification logic here
          // }
        }
        
      
      } catch (error) {
        console.error('Error processing completed checkout session:', error);
      }
      break;
    }
      
    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Session expired:', session.id);
      
      // Update your database to mark the checkout as abandoned
      // await Order.findOneAndUpdate(
      //   { checkoutSessionId: session.id },
      //   { status: 'abandoned' }
      // );
      break;
    }
      
    // Add other event types you want to handle
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true });
 
};

const getCheckoutSessionStatusStripe = async (req: Request, res: Response) => {
  const sessionId = req.query.session_id as String;
  
  console.log("Session status here");
  
  if (!sessionId || typeof sessionId !== 'string') {
    res.status(404).json({
      message: "No Session Id",
      data: {}
    });
    return;
  }
  
  try {
    // Pass the raw string without JSON.stringify
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    res.status(200).json({
      message: "Payment Success",
      data: {
        status: session.status,
        customer_email: session.customer_details?.email || 'No email provided'
      }
    });
  } catch (error: any) {
    console.error('Error retrieving checkout session:', error.message);
    res.status(500).json({
      message: "Error retrieving checkout session",
      error: error.message
    });
  }
};

export { 
  createStripeAccount, 
  createStripeAccountLink, 
  createStripeCheckoutSession, 
  handleStripeWebhook,
  getCheckoutSessionStatusStripe

};
