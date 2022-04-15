import { Message } from 'discord.js'
import { ExtendedClient } from '../Structures/Client'
import { BaseEvent } from '../Structures/Event'

export default class MessageEvent extends BaseEvent {
    constructor() {
        super('messageCreate')
    }
    async run(client: ExtendedClient, message: Message) {
        console.log(message.content)
    }
}
