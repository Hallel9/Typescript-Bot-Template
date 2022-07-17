import { PermissionFlagsBits } from 'discord.js'
import { Command } from '../../Structures/Command'

export default new Command({
    name: 'ping',
    description: 'Pong!',
    userPermissions: [PermissionFlagsBits.Administrator],
    run: ({ interaction, client }) => {
        interaction.reply({ content: 'Pong!' + ` ${client.ws.ping}` })
    }
})
