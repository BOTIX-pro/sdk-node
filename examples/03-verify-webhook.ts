/**
 * Проверка подписи входящего webhook BOTIX.
 *
 * Минимальный HTTP-сервер на Node.js без зависимостей.
 * Принимает POST на /webhook, проверяет заголовок `X-Botix-Signature`.
 *
 * Запуск:
 *   BOTIX_WEBHOOK_SECRET=wsec_... npx tsx examples/03-verify-webhook.ts
 *   # И отдельным окном:
 *   curl -X POST http://localhost:3000/webhook \
 *        -H 'X-Botix-Signature: ...' \
 *        -d '{"event":"test","data":{}}'
 */

import { createServer } from 'node:http';
import { verifyWebhook } from '@botix/sdk';

const secret = process.env.BOTIX_WEBHOOK_SECRET;
if (!secret) {
    console.error('Установите BOTIX_WEBHOOK_SECRET');
    process.exit(1);
}

const server = createServer((req, res) => {
    if (req.method !== 'POST' || req.url !== '/webhook') {
        res.statusCode = 404;
        res.end();
        return;
    }

    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
        const rawBody = Buffer.concat(chunks);
        const signature = req.headers['x-botix-signature'];

        if (typeof signature !== 'string' || !verifyWebhook(rawBody, signature, secret)) {
            res.statusCode = 401;
            res.end('invalid signature');
            return;
        }

        const event = req.headers['x-botix-event'];
        const requestId = req.headers['x-botix-request-id'];
        console.log(`OK: event=${event} request_id=${requestId}`);
        console.log('Payload:', JSON.parse(rawBody.toString('utf8')));

        res.statusCode = 200;
        res.end('ok');
    });
});

server.listen(3000, () => {
    console.log('Webhook слушает http://localhost:3000/webhook');
});
