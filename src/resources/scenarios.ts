import type {
    ScenariosApi,
    ScenariosRunRequest,
} from '../generated/api';

export class ScenariosResource {
    constructor(private readonly api: ScenariosApi) {}

    list() {
        return this.api.scenariosList();
    }

    /**
     * Запустить сценарий для контакта. Поддерживает `Idempotency-Key` —
     * автоматически проставляется клиентом, если не передан явно.
     */
    run(id: number, body: ScenariosRunRequest, idempotencyKey?: string) {
        return this.api.scenariosRun({
            id,
            scenariosRunRequest: body,
            idempotencyKey,
        });
    }
}
