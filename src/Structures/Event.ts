import {ClientEvents} from 'discord.js'
import {ExtendedClient} from './Client'

type EventRun = (client: ExtendedClient, ...args: any[]) => any
export class Event {
    constructor(public event: keyof ClientEvents, public run: EventRun) {
        Object.assign(this, {event, run})
    }
}
