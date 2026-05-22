import type {
    MessagesApi,
    MessagesApiMessagesListRequest,
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
}
