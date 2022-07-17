import { Command } from '../../Structures/Command'
import Discord, { ApplicationCommandOptionType, ButtonStyle, Colors, ActionRowBuilder, ComponentType, ButtonBuilder } from 'discord.js'
import db from '../../models/suggest'
export default new Command({
    name: 'suggest',
    description: 'Suggest a feature to be added to the bot.',
    options: [
        {
            name: 'type',
            type: ApplicationCommandOptionType.String,
            required: true,
            description: 'The type of suggestion.',
            choices: [
                {
                    name: 'Command',
                    value: 'Command'
                },
                {
                    name: 'Event',
                    value: 'Event'
                },
                {
                    name: 'System',
                    value: 'System'
                },
                {
                    name: 'Other',
                    value: 'Other'
                }
            ]
        },
        {
            name: 'suggestion',
            type: ApplicationCommandOptionType.String,
            required: true,
            description: 'The suggestion.'
        }
    ],
    run: async ({ interaction, client }) => {
        const type = interaction.options.getString('type')
        const suggestion = interaction.options.getString('suggestion')
        const embed = new Discord.EmbedBuilder()
            .setColor(Colors.DarkBlue)
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ forceStatic: true, extension: 'png', size: 1024 }) })
            .addFields(
                {
                    name: 'Suggestion',
                    value: suggestion,
                    inline: true
                },
                {
                    name: 'Type',
                    value: type,
                    inline: true
                },
                {
                    name: 'Status',
                    value: 'Pending',
                    inline: true
                }
            )
            .setTimestamp()
        const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(new Discord.ButtonBuilder().setCustomId('suggest-accept').setLabel('Accept').setStyle(ButtonStyle.Success).setEmoji('<:greytick:907281080346882058>'), new Discord.ButtonBuilder().setCustomId('suggest-decline').setLabel('Decline').setStyle(ButtonStyle.Danger).setEmoji('<:greycross:907281080275599401>'))
        const m = await interaction.reply({ embeds: [embed], components: [buttons], fetchReply: true })

        await db.create({
            Guild: interaction.guild.id,
            MessageID: m.id,
            Details: [
                {
                    MemberID: interaction.member.id,
                    Type: type,
                    Suggestion: suggestion
                }
            ]
        })
        //@ts-ignore
        m.react('👍')
        //@ts-ignore
        m.react('👎')
    }
})
