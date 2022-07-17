import { ExtendedClient } from '../Structures/Client'
import { BaseEvent } from '../Structures/Event'
import { ExtendedButtonInteraction, ExtendedInteraction } from '../typings/Command'
import db from '../models/suggest'
import { InteractionType, PermissionFlagsBits } from 'discord.js'

export default class InteractionCreateEvent extends BaseEvent {
    constructor() {
        super('interactionCreate')
    }
    async run(client: ExtendedClient, interaction: ExtendedButtonInteraction) {
        switch (interaction.customId) {
            case 'suggest-accept':
                {
                    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) return interaction.reply({ content: 'You cannot use this button', ephemeral: true })
                    const data = await db.findOne({ Guild: interaction.guildId, MessageID: interaction.message.id })
                    if (!data) return interaction.reply({ content: 'No data was found in the database', ephemeral: true })
                    const embed = interaction.message.embeds[0]
                    if (!embed) return
                    embed.fields[2] = {
                        name: 'Status',
                        value: 'Accepted',
                        inline: true
                    }
                    //@ts-ignore
                    interaction.message.edit({ embeds: [embed.setColor('GREEN')], components: [] })
                    return interaction.reply({ content: 'Suggestion Accepted', ephemeral: true })
                }
                break
            case 'suggest-decline':
                {
                    //@ts-ignore
                    if (!interaction.member.permissions.has('MANAGE_MESSAGES')) return interaction.reply({ content: 'You cannot use this button', ephemeral: true })
                    const { guildId, customId, message } = interaction
                    const data = await db.findOne({ Guild: guildId, MessageID: message.id })
                    if (!data) return interaction.reply({ content: 'No data was found in the database', ephemeral: true })
                    const embed = message.embeds[0]
                    if (!embed) return
                    embed.fields[2] = {
                        name: 'Status',
                        value: 'Declined',
                        inline: true
                    }
                    //@ts-ignore
                    message.edit({
                        //@ts-ignore
                        embeds: [embed.setColor('RED')],
                        components: []
                    })
                    return interaction.reply({ content: `Your suggestion has been declined`, ephemeral: true })
                }
                break
        }
    }
}
