import type {
    DefaultApi,
    DefaultApiPublicV1MessagesGetRequest,
    PublicV1MessagesPostRequest,
} from '../generated/api';

export class MessagesResource {
    constructor(private readonly api: DefaultApi) {}

    list(params: DefaultApiPublicV1MessagesGetRequest = {}) {
        return this.api.publicV1MessagesGet(params);
    }

    /**
     * Отправить сообщение контакту. Сервер поддерживает заголовок `Idempotency-Key`
     * для защиты от дублей — клиент проставляет его автоматически, если не передан
     * явно через параметр.
     */
    send(body: PublicV1MessagesPostRequest, idempotencyKey?: string) {
        return this.api.publicV1MessagesPost({
            publicV1MessagesPostRequest: body,
            idempotencyKey,
        });
    }
}
