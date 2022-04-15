import chalk from 'chalk'
import { ExtendedClient } from '../Structures/Client'
import { BaseEvent } from '../Structures/Event'

export default class ReadyEvent extends BaseEvent {
    constructor() {
        super('ready')
    }
    async run(client: ExtendedClient) {
        console.log(chalk.green.bold.underline('Ready!'))
        client.user.setActivity({ name: 'With TypeScript', type: 'PLAYING' })
    }
}
