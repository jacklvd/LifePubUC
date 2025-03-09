import { Request, Response } from "express";
import Stripe from "stripe";
import User from "../models/userSchema";
import Item from "../models/itemSchema";
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

    console.log("Line Items: ", lineItems);

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
      return_url: `${process.env.FRONTEND_URL}/checkout`,
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

export { createStripeAccount, createStripeAccountLink, createStripeCheckoutSession };
