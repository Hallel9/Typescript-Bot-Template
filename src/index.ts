import { GatewayCloseCodes, GatewayIntentBits } from 'discord.js'
import { ExtendedClient } from './Structures/Client'

export const client = new ExtendedClient({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers]
})

client.start()
