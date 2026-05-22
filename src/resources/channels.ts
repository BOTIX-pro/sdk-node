import type { ChannelsApi } from '../generated/api';

export class ChannelsResource {
    constructor(private readonly api: ChannelsApi) {}

    list() {
        return this.api.channelsList();
    }
}
