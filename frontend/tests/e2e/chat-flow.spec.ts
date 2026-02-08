import { test, expect, type Page } from '@playwright/test';
import { sendChatMessage } from './utils';

test('buyer chat flow: signup, browse, cart, checkout, payment link', async ({ page }: { page: Page }) => {
  await page.goto('/');

  await page.getByTestId('role-button-buyer').click();

  const email = `buyer.ui+e2e${Date.now()}@example.com`;
  const password = 'Passw0rd!';

  let agentMessage = await sendChatMessage(
    page,
    `sign me up name: Buyer UI, email: ${email}, password: ${password}, role: buyer`
  );
  await expect(agentMessage).toContainText('Signup complete');

  const lastUserMessage = page.locator('[data-testid="chat-message-user"]').last();
  await expect(lastUserMessage).not.toContainText(password);

  agentMessage = await sendChatMessage(page, 'browse tomatoes');
  await expect(agentMessage).toContainText('top options');
  await expect(page.locator('[data-testid="chat-product-card"]')).toHaveCount(1, { timeout: 30000 });

  agentMessage = await sendChatMessage(page, 'add to cart product: tomatoes quantity: 2');
  await expect(agentMessage).toContainText('Added to cart');

  agentMessage = await sendChatMessage(
    page,
    'checkout street: 1 Market Rd city: Lagos state: Lagos zip code: 100001'
  );
  await expect(agentMessage).toContainText('Order created');

  agentMessage = await sendChatMessage(page, 'pay for last order');
  await expect(agentMessage).toContainText('Payment initialized');
  await expect(page.locator('[data-testid="chat-link-button"]')).toHaveCount(1, { timeout: 30000 });
});
