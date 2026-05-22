import type { DefaultApi } from '../generated/api';

export class MeResource {
    constructor(private readonly api: DefaultApi) {}

    /** Контекст текущего ключа: project_id, scopes, тариф, остаток rate-limit. */
    get() {
        return this.api.publicV1MeGet();
    }
}
