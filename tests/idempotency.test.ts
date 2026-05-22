import { describe, expect, it, vi } from 'vitest';
import axios from 'axios';

import { BotixClient } from '../src/client';

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function makeMockedAxios() {
    const adapter = vi.fn(async (config) => ({
        data: { success: true, data: { id: 1 } },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
    }));
    const ax = axios.create();
    ax.defaults.adapter = adapter as never;
    return { ax, adapter };
}

describe('Idempotency-Key interceptor', () => {
    it('adds an auto-generated UUID v4 to POST /messages', async () => {
        const { ax, adapter } = makeMockedAxios();
        const client = new BotixClient('btx_live_x', { axiosInstance: ax });

        await client.messages.send({ contact_id: 1, text: 'hi' } as never);

        const sent = adapter.mock.calls[0][0];
        const key = sent.headers['Idempotency-Key'] ?? sent.headers.get?.('Idempotency-Key');
        expect(key).toMatch(UUID_V4);
    });

    it('does not overwrite an Idempotency-Key explicitly provided by the caller', async () => {
        const { ax, adapter } = makeMockedAxios();
        const client = new BotixClient('btx_live_x', { axiosInstance: ax });

        await client.messages.send(
            { contact_id: 1, text: 'hi' } as never,
            'caller-supplied-key-1',
        );

        const sent = adapter.mock.calls[0][0];
        const key = sent.headers['Idempotency-Key'] ?? sent.headers.get?.('Idempotency-Key');
        expect(key).toBe('caller-supplied-key-1');
    });

    it('does not add Idempotency-Key to non-mutating GET requests', async () => {
        const { ax, adapter } = makeMockedAxios();
        const client = new BotixClient('btx_live_x', { axiosInstance: ax });

        await client.contacts.list({ page: 1 });

        const sent = adapter.mock.calls[0][0];
        const key = sent.headers['Idempotency-Key'] ?? sent.headers.get?.('Idempotency-Key');
        expect(key).toBeUndefined();
    });

    it('does not add Idempotency-Key to endpoints that do not declare it (POST /webhooks)', async () => {
        const { ax, adapter } = makeMockedAxios();
        const client = new BotixClient('btx_live_x', { axiosInstance: ax });

        await client.webhooks.create({
            url: 'https://example.com/hook',
            events: ['message.received'],
        } as never);

        const sent = adapter.mock.calls[0][0];
        const key = sent.headers['Idempotency-Key'] ?? sent.headers.get?.('Idempotency-Key');
        expect(key).toBeUndefined();
    });

    it('can be disabled via ClientOptions.disableIdempotency', async () => {
        const { ax, adapter } = makeMockedAxios();
        const client = new BotixClient('btx_live_x', {
            axiosInstance: ax,
            disableIdempotency: true,
        });

        await client.messages.send({ contact_id: 1, text: 'hi' } as never);

        const sent = adapter.mock.calls[0][0];
        const key = sent.headers['Idempotency-Key'] ?? sent.headers.get?.('Idempotency-Key');
        expect(key).toBeUndefined();
    });
});
