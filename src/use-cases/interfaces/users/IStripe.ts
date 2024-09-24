export interface IStripe {
  makePayment(amount: number, service: string): Promise<string>;
  verifySucessOfWebhook(req: any): Promise<any>;
}
