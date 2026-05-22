import type {
    DefaultApi,
    DefaultApiPublicV1ChatsGetRequest,
    DefaultApiPublicV1ChatsIdMessagesGetRequest,
} from '../generated/api';

export class ChatsResource {
    constructor(private readonly api: DefaultApi) {}

    list(params: DefaultApiPublicV1ChatsGetRequest = {}) {
        return this.api.publicV1ChatsGet(params);
    }

    messages(params: DefaultApiPublicV1ChatsIdMessagesGetRequest) {
        return this.api.publicV1ChatsIdMessagesGet(params);
    }
}
