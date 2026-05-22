/**
 * Первый запрос: проверка работающего ключа через GET /me.
 *
 * Запуск:
 *   BOTIX_API_KEY=btx_live_... npx tsx examples/01-first-request.ts
 */

import { BotixClient } from '@botix/sdk';

const apiKey = process.env.BOTIX_API_KEY;
if (!apiKey) {
    console.error('Установите BOTIX_API_KEY в окружении');
    process.exit(1);
}

const client = new BotixClient(apiKey);

(async () => {
    const response = await client.me.get();
    const me = response.data;
    console.log('Проект:', me.data?.project_id);
    console.log('Тариф:', me.data?.plan_key);
    console.log('Scopes:', me.data?.scopes);
    console.log('Остаток лимита (per minute):', me.data?.rate_limit?.minute_remaining);
})();
