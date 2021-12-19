import {ExtendedClient} from './Structures/Client'

export const client = new ExtendedClient({
    intents: 32767
})

client.start()
