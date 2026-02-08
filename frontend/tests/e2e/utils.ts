/// <reference types="node" />
import { expect, type APIRequestContext, type Page } from '@playwright/test';
import crypto from 'crypto';

const API_BASE_URL = process.env.E2E_API_URL || 'http://localhost:5002/api';
const PAYSTACK_SECRET = process.env.E2E_PAYSTACK_SECRET || 'test_secret';

export const api = {
  baseUrl: API_BASE_URL,
  paystackSecret: PAYSTACK_SECRET,
  async register(request: APIRequestContext, payload: Record<string, unknown>) {
    const response = await request.post(`${API_BASE_URL}/auth/register`, { data: payload });
    return response.json();
  },
  async login(request: APIRequestContext, payload: { email: string; password: string }) {
    const response = await request.post(`${API_BASE_URL}/auth/login`, { data: payload });
    return response.json();
  },
  async getProducts(request: APIRequestContext) {
    const response = await request.get(`${API_BASE_URL}/products`);
    return response.json();
  },
  async createOrder(request: APIRequestContext, token: string, payload: Record<string, unknown>) {
    const response = await request.post(`${API_BASE_URL}/orders`, {
      data: payload,
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  },
  async createShipment(request: APIRequestContext, token: string, payload: Record<string, unknown>) {
    const response = await request.post(`${API_BASE_URL}/shipments`, {
      data: payload,
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  },
  async initializePayment(request: APIRequestContext, token: string, orderId: string) {
    const response = await request.post(`${API_BASE_URL}/payments/paystack/initialize`, {
      data: { orderId },
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  },
  async verifyPayment(request: APIRequestContext, token: string, reference: string) {
    const response = await request.get(`${API_BASE_URL}/payments/paystack/verify?reference=${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  },
  async getOrder(request: APIRequestContext, token: string, orderId: string) {
    const response = await request.get(`${API_BASE_URL}/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.json();
  },
  async triggerPaystackWebhook(request: APIRequestContext, payload: Record<string, unknown>) {
    const body = JSON.stringify(payload);
    const signature = crypto.createHmac('sha512', PAYSTACK_SECRET).update(body).digest('hex');
    const response = await request.post(`${API_BASE_URL}/payments/paystack/webhook`, {
      data: payload,
      headers: { 'x-paystack-signature': signature }
    });
    return response.json();
  }
};

export const buildShippingAddress = () => ({
  street: '1 Market Rd',
  city: 'Lagos',
  state: 'Lagos',
  zipCode: '100001'
});

export const waitForAgentResponse = async (page: Page) => {
  const agentMessage = page.locator('[data-testid="chat-message-agent"]').last();
  await expect(agentMessage).toBeVisible({ timeout: 30000 });
  await expect(agentMessage).not.toHaveText(/Typing\.{0,3}/, { timeout: 30000 });
  return agentMessage;
};

export const sendChatMessage = async (page: Page, message: string) => {
  await page.getByTestId('chat-input').fill(message);
  await page.getByTestId('chat-send').click();
  return waitForAgentResponse(page);
};

export const waitForOnboardingResponse = async (page: Page) => {
  const agentMessage = page.locator('[data-testid="onboarding-message-agent"]').last();
  await expect(agentMessage).toBeVisible({ timeout: 30000 });
  await expect(agentMessage).not.toHaveText(/Typing\.{0,3}/, { timeout: 30000 });
  return agentMessage;
};

export const sendOnboardingMessage = async (page: Page, message: string) => {
  await page.getByTestId('onboarding-chat-input').fill(message);
  await page.getByTestId('onboarding-chat-send').click();
  return waitForOnboardingResponse(page);
};
