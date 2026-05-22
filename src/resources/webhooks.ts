import type {
    PublicV1WebhooksIdPutRequest,
    PublicV1WebhooksPostRequest,
    WebhooksApi,
} from '../generated/api';

export class WebhooksResource {
    constructor(private readonly api: WebhooksApi) {}

    list() {
        return this.api.publicV1WebhooksGet();
    }

    create(body: PublicV1WebhooksPostRequest) {
        return this.api.publicV1WebhooksPost({ publicV1WebhooksPostRequest: body });
    }

    update(id: number, body: PublicV1WebhooksIdPutRequest) {
        return this.api.publicV1WebhooksIdPut({
            id,
            publicV1WebhooksIdPutRequest: body,
        });
    }

    delete(id: number) {
        return this.api.publicV1WebhooksIdDelete({ id });
    }

    /** Тестовая отправка — шлёт фиктивное событие `test` на URL подписки. */
    sendTest(id: number) {
        return this.api.publicV1WebhooksIdTestPost({ id });
    }
}
