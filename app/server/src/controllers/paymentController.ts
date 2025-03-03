import { Request, Response } from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const createAccountLink = async (req: Request, res: Response) => {
 try {
   const { account } = req.body;

   const accountLink = await stripe.accountLinks.create({
     account: account,
     return_url: `${req.headers.origin}/return/${account}`,
     refresh_url: `${req.headers.origin}/refresh/${account}`,
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

const createAccount = async (req: Request, res: Response) => {
 try {
   const account = await stripe.accounts.create({
     controller: {
       stripe_dashboard: {
         type: "none",
       },
     },
     capabilities: {
       card_payments: {requested: true},
       transfers: {requested: true}
     },
     country: "US",
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

export { createAccount, createAccountLink}