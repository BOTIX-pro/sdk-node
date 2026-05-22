import type {
    DefaultApi,
    PublicV1ScenariosIdRunPostRequest,
} from '../generated/api';

export class ScenariosResource {
    constructor(private readonly api: DefaultApi) {}

    list() {
        return this.api.publicV1ScenariosGet();
    }

    /**
     * Запустить сценарий для контакта. Поддерживает `Idempotency-Key` —
     * автоматически проставляется клиентом, если не передан явно.
     */
    run(id: number, body: PublicV1ScenariosIdRunPostRequest, idempotencyKey?: string) {
        return this.api.publicV1ScenariosIdRunPost({
            id,
            publicV1ScenariosIdRunPostRequest: body,
            idempotencyKey,
        });
    }
}
