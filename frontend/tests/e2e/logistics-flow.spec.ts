import { test, expect, type Page, type APIRequestContext } from '@playwright/test';
import { api, buildShippingAddress, sendChatMessage } from './utils';

test('logistics signup, offer capacity, accept dispatch via agent chat', async ({ page, request }: { page: Page; request: APIRequestContext }) => {
  const buyerEmail = `buyer.ui+dispatch${Date.now()}@example.com`;
  const buyerPassword = 'Passw0rd!';

  const buyerSignup = await api.register(request, {
    name: 'Dispatch Buyer',
    email: buyerEmail,
    password: buyerPassword,
    role: 'buyer'
  });
  const buyerToken = buyerSignup?.data?.token;
  expect(buyerToken).toBeTruthy();

  const products = await api.getProducts(request);
  const productId = products?.data?.products?.[0]?.id || products?.products?.[0]?.id;
  expect(productId).toBeTruthy();

  const orderPayload = {
    items: [{ productId, quantity: 1 }],
    shippingAddress: buildShippingAddress()
  };
  const orderResponse = await api.createOrder(request, buyerToken, orderPayload);
  const orderId = orderResponse?.data?.id || orderResponse?.data?.orderId;
  expect(orderId).toBeTruthy();

  const adminLogin = await api.login(request, { email: 'admin@farmersea.com', password: 'admin123' });
  const adminToken = adminLogin?.data?.token;
  expect(adminToken).toBeTruthy();

  await api.createShipment(request, adminToken, {
    orderId,
    origin: 'Farm HQ',
    destination: 'Lagos Market'
  });

  await page.goto('/');
  await page.getByTestId('role-button-logistics').click();

  const email = `logistics.ui+e2e${Date.now()}@example.com`;
  const password = 'Passw0rd!';

  let agentMessage = await sendChatMessage(
    page,
    `sign me up name: Logistics UI, email: ${email}, password: ${password}, role: logistics`
  );
  await expect(agentMessage).toContainText('Signup complete');

  agentMessage = await sendChatMessage(
    page,
    'offer capacity route: Lagos to Jos capacity: 20 vehicle types: trucks cold-chain: yes'
  );
  await expect(agentMessage).toContainText('Capacity listing saved');

  agentMessage = await sendChatMessage(page, `accept dispatch orderId: ${orderId}`);
  await expect(agentMessage).toContainText('Dispatch accepted');
});
