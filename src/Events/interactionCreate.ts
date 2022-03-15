import {Event} from '../Structures/Event'
import {client} from '..'
import {CommandInteractionOptionResolver} from 'discord.js'
import {ExtendedInteraction} from '../typings/Command'

export default new Event('interactionCreate', async (client, interaction: ExtendedInteraction) => {
    // Chat Input Commands
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName)
        if (!command) return interaction.reply({content: 'You have used a non existent command.'})
        command.run({args: interaction.options as CommandInteractionOptionResolver, client, interaction: interaction as ExtendedInteraction})
    }
})
