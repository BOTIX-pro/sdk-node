import { describe, expect, it, vi } from 'vitest';
import axios from 'axios';

import { BotixClient, DEFAULT_BASE_URL } from '../src/client';
import { version } from '../src/index';

describe('BotixClient', () => {
    it('throws on empty apiKey', () => {
        expect(() => new BotixClient('')).toThrow(TypeError);
    });

    it('uses default base url when none provided', () => {
        const client = new BotixClient('btx_live_test');
        expect(client.baseUrl).toBe(DEFAULT_BASE_URL);
    });

    it('strips trailing slashes from custom base url', () => {
        const client = new BotixClient('btx_live_test', {
            baseUrl: 'https://example.com/////',
        });
        expect(client.baseUrl).toBe('https://example.com');
    });

    it('exposes the 7 documented resources', () => {
        const client = new BotixClient('btx_live_test');
        expect(client.me).toBeDefined();
        expect(client.contacts).toBeDefined();
        expect(client.messages).toBeDefined();
        expect(client.chats).toBeDefined();
        expect(client.scenarios).toBeDefined();
        expect(client.channels).toBeDefined();
        expect(client.webhooks).toBeDefined();
    });

    it('sends Authorization: Bearer header on requests', async () => {
        const ax = axios.create();
        const adapter = vi.fn(async (config) => ({
            data: { success: true, data: { project_id: 1 } },
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
        }));
        ax.defaults.adapter = adapter as never;

        const client = new BotixClient('btx_live_secret_token', { axiosInstance: ax });
        await client.me.get();

        expect(adapter).toHaveBeenCalledOnce();
        const sent = adapter.mock.calls[0][0];
        expect(sent.headers.Authorization).toBe('Bearer btx_live_secret_token');
    });

    it('exports a version string matching package.json', () => {
        expect(version).toBe('1.0.0');
    });
});
