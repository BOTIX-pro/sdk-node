import type {
    WebhooksApi,
    WebhooksCreateRequest,
    WebhooksUpdateRequest,
} from '../generated/api';

export class WebhooksResource {
    constructor(private readonly api: WebhooksApi) {}

    list() {
        return this.api.webhooksList();
    }

    create(body: WebhooksCreateRequest) {
        return this.api.webhooksCreate({ webhooksCreateRequest: body });
    }

    update(id: number, body: WebhooksUpdateRequest) {
        return this.api.webhooksUpdate({
            id,
            webhooksUpdateRequest: body,
        });
    }

    delete(id: number) {
        return this.api.webhooksDelete({ id });
    }

    /** Тестовая отправка — шлёт фиктивное событие `test` на URL подписки. */
    sendTest(id: number) {
        return this.api.webhooksTest({ id });
    }
}
