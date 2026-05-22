import type {
    MessagesApi,
    MessagesApiMessagesListRequest,
    MessagesBulkSendRequest,
    MessagesSendRequest,
} from '../generated/api';

export class MessagesResource {
    constructor(private readonly api: MessagesApi) {}

    list(params: MessagesApiMessagesListRequest = {}) {
        return this.api.messagesList(params);
    }

    /**
     * Отправить сообщение контакту. Сервер поддерживает заголовок `Idempotency-Key`
     * для защиты от дублей — клиент проставляет его автоматически, если не передан
     * явно через параметр.
     */
    send(body: MessagesSendRequest, idempotencyKey?: string) {
        return this.api.messagesSend({
            messagesSendRequest: body,
            idempotencyKey,
        });
    }

    /**
     * Массовая отправка сообщений (до 100 за один запрос). Bulk не обходит
     * per-bot rate-limit: если за минуту лимит превышен, оставшиеся сообщения
     * вернутся с `RATE_LIMIT_EXCEEDED` в `results[i].error`. Допустим частичный
     * успех. Заголовок `Idempotency-Key` проставляется автоматически, если не
     * передан явно.
     */
    bulkSend(body: MessagesBulkSendRequest, idempotencyKey?: string) {
        return this.api.messagesBulkSend({
            messagesBulkSendRequest: body,
            idempotencyKey,
        });
    }
}
