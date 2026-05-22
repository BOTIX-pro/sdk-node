import type { DefaultApi } from '../generated/api';

export class ChannelsResource {
    constructor(private readonly api: DefaultApi) {}

    list() {
        return this.api.publicV1ChannelsGet();
    }
}
