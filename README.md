# BOTIX SDK для Node.js

[![npm version](https://img.shields.io/npm/v/@botix/sdk.svg)](https://www.npmjs.com/package/@botix/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/BOTIX-pro/sdk-node/actions/workflows/test.yml/badge.svg)](https://github.com/BOTIX-pro/sdk-node/actions/workflows/test.yml)

Официальная клиентская библиотека для публичного API BOTIX — платформы визуального конструктора чат-ботов и AI-ассистентов.

## Что это

BOTIX (`botix.pro`) — SaaS-платформа для создания чат-ботов, AI-ассистентов и сценариев в мессенджерах. Публичный API позволяет управлять контактами, сообщениями, чатами, сценариями и подписками на события из любого внешнего сервиса. Этот SDK — обёртка над REST API с типами TypeScript и удобными хелперами.

## Установка

```bash
npm install @botix/sdk
```

Требуется Node.js **18+**.

## Первый запрос

API-ключ создаётся в кабинете BOTIX: **Настройки → API-ключи**.

```typescript
import { BotixClient } from '@botix/sdk';

const client = new BotixClient(process.env.BOTIX_API_KEY!);

const { data: me } = await client.me.get();
console.log(me.data?.project_id, me.data?.plan_key, me.data?.scopes);
```

## Отправка сообщения

```typescript
const { data: result } = await client.messages.send({
    contact_id: 42,
    text: 'Здравствуйте! Это сообщение из SDK.',
});

console.log('Сообщение отправлено:', result.data?.message_id);
```

Заголовок `Idempotency-Key` проставляется автоматически как UUID v4 — повторный сетевой запрос не создаст дубликат сообщения. Передайте свой ключ вторым аргументом, если хотите управлять им вручную: `client.messages.send(body, 'my-key')`.

## Webhooks: проверка подписи

BOTIX подписывает каждую доставку заголовком `X-Botix-Signature` (HMAC-SHA256 от тела запроса). На стороне клиента нужно проверить подпись до обработки события:

```typescript
import { createServer } from 'node:http';
import { verifyWebhook } from '@botix/sdk';

const server = createServer((req, res) => {
    const chunks: Buffer[] = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
        const rawBody = Buffer.concat(chunks);
        const signature = req.headers['x-botix-signature'] as string;

        if (!verifyWebhook(rawBody, signature, process.env.BOTIX_WEBHOOK_SECRET!)) {
            res.statusCode = 401;
            res.end();
            return;
        }
        res.statusCode = 200;
        res.end('ok');
    });
});

server.listen(3000);
```

`verifyWebhook` использует `crypto.timingSafeEqual` — защищает от timing-атак.

## Работа с ошибками

API возвращает структурированные ошибки в формате `{ success: false, error: { code, message, details } }`. SDK прокидывает их через `AxiosError`:

```typescript
import axios from 'axios';

try {
    await client.messages.send({ contact_id: 42, text: 'привет' });
} catch (err) {
    if (axios.isAxiosError(err)) {
        const { code, message } = err.response?.data?.error ?? {};
        console.error(`BOTIX вернул ${err.response?.status}: ${code} — ${message}`);
    }
}
```

| HTTP | Код | Когда |
|---|---|---|
| 401 | `MISSING_API_KEY` / `INVALID_API_KEY` / `KEY_REVOKED` | Нет/неправильный/отозванный ключ |
| 403 | `INSUFFICIENT_SCOPE` | У ключа нет нужного scope |
| 403 | `API_NOT_AVAILABLE_ON_PLAN` | Тариф не включает API |
| 403 | `TRIAL_READ_ONLY` | Триал-тариф, мутирующие методы запрещены |
| 422 | `CONTACT_NOT_FOUND` / `NO_CHANNEL_AVAILABLE` / … | Бизнес-ошибки модели |
| 429 | `RATE_LIMIT_EXCEEDED` | Превышен лимит per-minute или per-day |
| 502 | `DELIVERY_FAILED` | Канал отверг отправку |

Полный список — в разделе «Коды ошибок» документации `developers.botix.pro`.

## Ресурсы

```typescript
client.me.get()
client.contacts.list() / .get() / .create() / .update() / .delete() / .addTag() / .removeTag()
client.messages.list() / .send()
client.chats.list() / .messages()
client.scenarios.list() / .run()
client.channels.list()
client.webhooks.list() / .create() / .update() / .delete() / .sendTest()
```

## Ссылки

- Документация API: [developers.botix.pro](https://developers.botix.pro)
- Для разработчиков: [botix.pro/developers](https://botix.pro/developers)
- Репозиторий SDK: [github.com/BOTIX-pro/sdk-node](https://github.com/BOTIX-pro/sdk-node)
- Issue tracker: [github.com/BOTIX-pro/sdk-node/issues](https://github.com/BOTIX-pro/sdk-node/issues)
- SDK для других языков: [PHP](https://github.com/BOTIX-pro/sdk-php), [Python](https://github.com/BOTIX-pro/sdk-python)

## Лицензия

MIT © BOTIX (IE Shpagin V.V.)
