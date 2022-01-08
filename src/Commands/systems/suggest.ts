import {Command} from '../../Structures/Command'
import Discord, {MessageActionRow} from 'discord.js'
import db from '../../models/suggest'
export default new Command({
    name: 'suggest',
    description: 'Suggest a feature to be added to the bot.',
    options: [
        {
            name: 'type',
            type: 'STRING',
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
            type: 'STRING',
            required: true,
            description: 'The suggestion.'
        }
    ],
    run: async ({interaction, client}) => {
        const type = interaction.options.getString('type')
        const suggestion = interaction.options.getString('suggestion')
        const embed = new Discord.MessageEmbed()
            .setColor('DARK_BLUE')
            .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({dynamic: true, format: 'png', size: 1024}))
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
        const buttons = new MessageActionRow().addComponents(new Discord.MessageButton().setCustomId('suggest-accept').setLabel('Accept').setStyle('SUCCESS').setEmoji('<:greytick:907281080346882058>'), new Discord.MessageButton().setCustomId('suggest-decline').setLabel('Decline').setStyle('DANGER').setEmoji('<:greycross:907281080275599401>'))
        const m = await interaction.reply({embeds: [embed], components: [buttons], fetchReply: true})

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
