import { Command } from '../../Structures/Command'
import { capitalize } from '../../functions/capitalize'
import Discord, { ButtonInteraction, Colors, ComponentType, InteractionType, SelectMenuBuilder } from 'discord.js'
export default new Command({
    name: 'help',
    description: 'Get help on a command.',
    run: async ({ client, interaction }) => {
        const args = []
        const emojis = {
            info: 'ℹ️',
            fun: '🎲',
            systems: '📦'
        }
        const directory = [...new Set(client.commands.map((cmd) => cmd.directory))]
        const formatString = (str) => `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`
        const categories = directory.map((dir) => {
            const getCommands = client.commands
                .filter((cmd) => cmd.directory === dir)
                .map((cmd) => {
                    if (cmd.ownerOnly) return
                    return {
                        name: cmd.name || 'No Command Name',
                        description: capitalize(cmd.description) || 'No command description'
                    }
                })
            return {
                directory: formatString(dir),
                commands: getCommands
            }
        })
        const embed = new Discord.EmbedBuilder().setColor(Colors.Red).setDescription('Please choose a category from the dropdown menu')
        const components = (state) => [
            new Discord.ActionRowBuilder<SelectMenuBuilder>(

            ).addComponents(
                new Discord.SelectMenuBuilder()
                    .setCustomId('help-menu')
                    .setPlaceholder('Please select a category')
                    .setDisabled(state)
                    .addOptions(
                        categories.map((cmd) => {
                            return {
                                label: cmd.directory,
                                value: cmd.directory.toLowerCase(),
                                description: `Commands from ${capitalize(cmd.directory)} category`,
                                emoji: emojis[cmd.directory.toLowerCase()] || null
                            }
                        })
                    )
            )
        ]
        await interaction.reply({ embeds: [embed], components: components(false) })
        const filter = (i: ButtonInteraction) => i.user.id === interaction.user.id
        const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.SelectMenu, time: 30000 })
        collector.on('collect', async (i) => {
            const [directory] = i.values
            const category = categories.find((x) => x.directory.toLowerCase() === directory)
            const embed1 = new Discord.EmbedBuilder()
                .setTitle(`${emojis[directory.toLowerCase()] || ''} ${capitalize(directory)} commands`)
                .setDescription('Here is the list of commands')
                .addFields(
                    category.commands.map((cmd) => {
                        return {
                            name: `\`${capitalize(cmd.name)}\``,
                            value: `${capitalize(cmd.description)}`,
                            inline: true
                        }
                    })
                )
            i.update({ embeds: [embed1] })
        })
        collector.on('end', () => {
            interaction.editReply({ components: components(true) })
        })
    }
})
