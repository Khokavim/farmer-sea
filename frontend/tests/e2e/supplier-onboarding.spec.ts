import { test, expect, type Page } from '@playwright/test';
import { sendOnboardingMessage, waitForOnboardingResponse } from './utils';

test('supplier onboarding chat summary responds', async ({ page }: { page: Page }) => {
  await page.goto('/agent-onboarding?role=supplier');

  const initialAgent = page.locator('[data-testid="onboarding-message-agent"]').first();
  if (await initialAgent.count()) {
    await expect(initialAgent).toBeVisible();
  }

  const agentMessage = await sendOnboardingMessage(
    page,
    'We can supply 50 tons weekly, warehouse in Jos, cold-chain ready.'
  );
  await expect(agentMessage).toBeVisible();

  const latestUser = page.locator('[data-testid="onboarding-message-user"]').last();
  await expect(latestUser).toContainText('50 tons');

  await waitForOnboardingResponse(page);
});
