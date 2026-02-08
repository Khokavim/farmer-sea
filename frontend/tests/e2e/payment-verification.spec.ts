import { test, expect, type APIRequestContext } from '@playwright/test';
import { api, buildShippingAddress } from './utils';

test('payment verification updates order via webhook', async ({ request }: { request: APIRequestContext }) => {
  const buyerEmail = `buyer.ui+pay${Date.now()}@example.com`;
  const buyerPassword = 'Passw0rd!';

  const buyerSignup = await api.register(request, {
    name: 'Payment Buyer',
    email: buyerEmail,
    password: buyerPassword,
    role: 'buyer'
  });
  const buyerToken = buyerSignup?.data?.token;
  expect(buyerToken).toBeTruthy();

  const products = await api.getProducts(request);
  const productId = products?.data?.products?.[0]?.id || products?.products?.[0]?.id;
  expect(productId).toBeTruthy();

  const orderResponse = await api.createOrder(request, buyerToken, {
    items: [{ productId, quantity: 1 }],
    shippingAddress: buildShippingAddress()
  });
  const orderId = orderResponse?.data?.id || orderResponse?.data?.orderId;
  expect(orderId).toBeTruthy();

  const initResponse = await api.initializePayment(request, buyerToken, orderId);
  const reference = initResponse?.data?.reference;
  expect(reference).toBeTruthy();

  const webhookPayload = {
    event: 'charge.success',
    data: {
      reference,
      status: 'success'
    }
  };
  const webhookResponse = await api.triggerPaystackWebhook(request, webhookPayload);
  expect(webhookResponse?.received).toBe(true);

  const orderAfter = await api.getOrder(request, buyerToken, orderId);
  expect(orderAfter?.data?.paymentStatus).toBe('paid');
});
