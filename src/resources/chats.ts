import type {
    ChatsApi,
    ChatsApiChatsListRequest,
    ChatsApiChatsMessagesRequest,
} from '../generated/api';

export class ChatsResource {
    constructor(private readonly api: ChatsApi) {}

    list(params: ChatsApiChatsListRequest = {}) {
        return this.api.chatsList(params);
    }

    messages(params: ChatsApiChatsMessagesRequest) {
        return this.api.chatsMessages(params);
    }
}
