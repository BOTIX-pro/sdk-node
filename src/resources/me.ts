import type { SystemApi } from '../generated/api';

export class MeResource {
    constructor(private readonly api: SystemApi) {}

    /** Контекст текущего ключа: project_id, scopes, тариф, остаток rate-limit. */
    get() {
        return this.api.meGet();
    }
}
