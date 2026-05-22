import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import { verifyWebhook } from '../src/webhook';
import { BotixClient } from '../src/client';

const SECRET = 'wsec_test_supersecret_value';
const PAYLOAD = JSON.stringify({
    event: 'message.received',
    created_at: '2026-05-22T10:00:00Z',
    data: { contact_id: 42, text: 'привет' },
});

function sign(body: string, secret: string): string {
    return createHmac('sha256', secret).update(body, 'utf8').digest('hex');
}

describe('verifyWebhook', () => {
    it('returns true for a correctly signed payload', () => {
        const signature = sign(PAYLOAD, SECRET);
        expect(verifyWebhook(PAYLOAD, signature, SECRET)).toBe(true);
    });

    it('returns false for a tampered payload', () => {
        const signature = sign(PAYLOAD, SECRET);
        const tampered = PAYLOAD.replace('привет', 'злоумышленник');
        expect(verifyWebhook(tampered, signature, SECRET)).toBe(false);
    });

    it('returns false for a wrong secret', () => {
        const signature = sign(PAYLOAD, SECRET);
        expect(verifyWebhook(PAYLOAD, signature, 'wsec_wrong_secret_!!')).toBe(false);
    });

    it('returns false for an empty signature', () => {
        expect(verifyWebhook(PAYLOAD, '', SECRET)).toBe(false);
    });

    it('returns false when signature lengths differ (timing-safe path)', () => {
        expect(verifyWebhook(PAYLOAD, 'abc', SECRET)).toBe(false);
    });

    it('accepts a Buffer as raw payload', () => {
        const signature = sign(PAYLOAD, SECRET);
        const buf = Buffer.from(PAYLOAD, 'utf8');
        expect(verifyWebhook(buf, signature, SECRET)).toBe(true);
    });

    it('is exposed on BotixClient as both static and instance method', () => {
        const signature = sign(PAYLOAD, SECRET);
        expect(BotixClient.verifyWebhook(PAYLOAD, signature, SECRET)).toBe(true);

        const client = new BotixClient('btx_live_test');
        expect(client.verifyWebhook(PAYLOAD, signature, SECRET)).toBe(true);
    });
});
