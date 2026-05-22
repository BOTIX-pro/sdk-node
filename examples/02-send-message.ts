/**
 * Отправка сообщения существующему контакту.
 *
 * Запуск:
 *   BOTIX_API_KEY=btx_live_... BOTIX_CONTACT_ID=42 npx tsx examples/02-send-message.ts
 */

import { BotixClient } from '@botix/sdk';

const apiKey = process.env.BOTIX_API_KEY;
const contactId = Number(process.env.BOTIX_CONTACT_ID ?? 0);

if (!apiKey || !contactId) {
    console.error('Установите BOTIX_API_KEY и BOTIX_CONTACT_ID');
    process.exit(1);
}

const client = new BotixClient(apiKey);

(async () => {
    const response = await client.messages.send({
        contact_id: contactId,
        text: 'Здравствуйте! Это сообщение из BOTIX SDK.',
    });

    const ok = response.data;
    console.log('Сообщение отправлено:', ok.data?.message_id);
    if (response.headers['idempotent-replayed'] === '1') {
        console.log('Внимание: ответ из идемпотентного кеша (повтор запроса).');
    }
})();
