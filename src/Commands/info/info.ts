import {GuildChannel, GuildMember, MessageEmbed, Role} from 'discord.js'
import {Command} from '../../Structures/Command'
import axios from 'axios'
import {capitalize} from '../../functions/capitalize'

export default new Command({
    name: 'info',
    description: 'Get information about things.',
    options: [
        {
            name: 'user',
            description: 'Show info for a user',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'member',
                    description: 'Show info for a member',
                    type: 'USER',
                    required: true
                }
            ]
        },
        {
            name: 'channel',
            description: 'Show info for a channel',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'ch',
                    description: 'Show info for a channel',
                    type: 'CHANNEL',
                    required: true,
                    channelTypes: ['GUILD_TEXT', 'GUILD_VOICE']
                }
            ]
        },
        {
            name: 'role',
            description: 'Show info for a role',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'r',
                    description: 'Show info for a role',
                    type: 'ROLE',
                    required: true
                }
            ]
        },
        {
            name: 'server',
            description: 'Show info for a server',
            type: 'SUB_COMMAND'
        },
        {
            name: 'bot',
            description: 'Show info for the bot',
            type: 'SUB_COMMAND'
        }
    ],
    run: async ({client, interaction}) => {
        if (interaction.options.getSubcommand() === 'user') {
            const member = interaction.options.getMember('user') as GuildMember
            const res = await axios.get(`https://discord.com/api/v9/users/${member.id}`, {
                headers: {
                    Authorization: `Bot ${client.token}`
                }
            })
            const {banner, accent_color} = res.data
            if (banner) {
                const extension = banner.startsWith('a_') ? '.gif' : '.png'
                const url = `https://cdn.discordapp.com/banners/${member.id}/${banner}${extension}`
                const embed = new MessageEmbed()
                    .setAuthor(member.user.tag, member.user.displayAvatarURL({dynamic: true, format: 'png', size: 1024}))
                    .setColor(member.displayHexColor)
                    .addFields(
                        {
                            name: 'id',
                            value: `${member.id}`,
                            inline: true
                        },
                        {
                            name: 'Account Created',
                            value: `<t:${Math.round(member.user.createdTimestamp / 1000)}:F> - <t:${Math.round(member.user.createdTimestamp / 1000)}:R>`,
                            inline: true
                        },
                        {
                            name: 'Joined Server',
                            value: `<t:${Math.round(member.joinedTimestamp / 1000)}:F> - <t:${Math.round(member.joinedTimestamp / 1000)}:R>`
                        },
                        {
                            name: 'Roles',
                            value:
                                `${member.roles.cache
                                    .map((role) => role.toString())
                                    .join(',\n')
                                    .slice(0, -11)}` || 'None',
                            inline: true
                        }
                    )
                    .setImage(url)
                interaction.reply({embeds: [embed]})
            } else {
                if (accent_color) {
                    const embed = new MessageEmbed()
                        .setAuthor(member.user.tag, member.user.displayAvatarURL({dynamic: true, format: 'png', size: 1024}))
                        .setColor(accent_color)
                        .addFields(
                            {
                                name: 'id',
                                value: `${member.id}`,
                                inline: true
                            },
                            {
                                name: 'Account Created',
                                value: `<t:${Math.round(member.user.createdTimestamp / 1000)}:F> - <t:${Math.round(member.user.createdTimestamp / 1000)}:R>`,
                                inline: true
                            },
                            {
                                name: 'Joined Server',
                                value: `<t:${Math.round(member.joinedTimestamp / 1000)}:F> - <t:${Math.round(member.joinedTimestamp / 1000)}:R>`
                            },
                            {
                                name: 'Roles',
                                value:
                                    `${member.roles.cache
                                        .map((role) => role.toString())
                                        .join(',\n')
                                        .slice(0, -11)}` || 'None',
                                inline: true
                            }
                        )
                        .setImage(member.displayAvatarURL({dynamic: true, format: 'png', size: 1024}))
                    interaction.reply({embeds: [embed]})
                } else {
                    const embed = new MessageEmbed()
                        .setAuthor(
                            member.user.tag,
                            member.displayAvatarURL({
                                dynamic: true,
                                format: 'png',
                                size: 1024
                            })
                        )
                        .setColor(member.displayHexColor)
                        .addFields(
                            {
                                name: 'id',
                                value: `${member.id}`,
                                inline: true
                            },
                            {
                                name: 'Account Created',
                                value: `<t:${Math.round(member.user.createdTimestamp / 1000)}:F> - <t:${Math.round(member.user.createdTimestamp / 1000)}:R>`,
                                inline: true
                            },
                            {
                                name: 'Joined Server',
                                // @ts-ignore
                                value: `<t:${Math.round(
                                    //@ts-ignore
                                    member.joinedTimestamp / 1000
                                )}:F>`,
                                inline: true
                            },
                            {
                                name: 'Roles',
                                value:
                                    `${member.roles.cache
                                        .map((role) => role.toString())
                                        .join(',\n')
                                        .slice(0, -11)}` || 'None',
                                inline: true
                            }
                        )
                        .setImage(
                            member.user.displayAvatarURL({
                                dynamic: true,
                                format: 'png',
                                size: 1024
                            })
                        )
                    interaction.reply({embeds: [embed]})
                }
            }
        } else if (interaction.options.getSubcommand() === 'channel') {
            const channel = interaction.options.getChannel('ch') as GuildChannel
            if (channel === null) return console.log('Channel is null')
            const channelEmbed = new MessageEmbed()
                .setAuthor(channel.name)
                .setColor('WHITE')
                .addFields(
                    {
                        name: 'id',
                        value: `${channel.id}`,
                        inline: true
                    },
                    {
                        name: 'Created',
                        value: `<t:${Math.round(channel.createdTimestamp / 1000)}:F> - <t:${Math.round(channel.createdTimestamp / 1000)}:R>`,
                        inline: true
                    },
                    {
                        name: 'type',
                        value: `${channel.type}`,
                        inline: true
                    },
                    {
                        name: 'Deletable',
                        value: `${channel.deletable ? 'Yes' : 'No'}`,
                        inline: true
                    }
                )
            interaction.reply({embeds: [channelEmbed]})
        } else if (interaction.options.getSubcommand() === 'role') {
            const role = interaction.options.getRole('r') as Role
            if (role === null) return console.log('role is null')
            const roleEmbed = new MessageEmbed()
                .setAuthor(role.name)
                .setColor(role.color)
                .addFields(
                    {
                        name: 'id',
                        value: `${role.id}`,
                        inline: true
                    },
                    {
                        name: 'Created',
                        value: `<t:${Math.round(role.createdTimestamp / 1000)}:F> - <t:${Math.round(role.createdTimestamp / 1000)}:R>`,
                        inline: true
                    },
                    {
                        name: 'Hoisted',
                        value: `${role.hoist ? 'Yes' : 'No'}`,
                        inline: true
                    },
                    {
                        name: 'Mentionable',
                        value: `${role.mentionable ? 'Yes' : 'No'}`,
                        inline: true
                    },
                    {
                        name: 'Managed',
                        value: `${role.managed ? 'Yes' : 'No'}`,
                        inline: true
                    },
                    {
                        name: 'Position',
                        value: `${role.position}`
                    },
                    {
                        name: 'Members',
                        value: `${role.members.size} members`,
                        inline: true
                    }
                )
            interaction.reply({embeds: [roleEmbed]})
        } else if (interaction.options.getSubcommand() == 'server') {
            const members = await interaction.guild.members.fetch()
            const owner = await interaction.guild.fetchOwner()
            const server = interaction.guild
            const serverEmbed = new MessageEmbed()
                .setAuthor(server.name)
                .setColor('WHITE')
                .addFields(
                    {
                        name: 'id',
                        value: `${server.id}`,
                        inline: true
                    },
                    {
                        name: 'Created',
                        value: `<t:${Math.round(server.createdTimestamp / 1000)}:F> - <t:${Math.round(server.createdTimestamp / 1000)}:R>`,
                        inline: true
                    },
                    {
                        name: 'Owner',
                        value: `${owner.user.tag} (${owner.id})`,
                        inline: true
                    },
                    {
                        name: 'Verification Level',
                        value: `${server.verificationLevel}`,
                        inline: true
                    },
                    {
                        name: 'Approx. Member Count',
                        value: `${server.approximateMemberCount}`,
                        inline: true
                    },
                    {
                        name: 'Approx. Presence Count',
                        value: `${server.approximatePresenceCount}`,
                        inline: true
                    },
                    {
                        name: 'Commands',
                        value: `${server.commands.cache.size} commands`,
                        inline: true
                    },
                    {
                        name: 'Role Count',
                        value: `${server.roles.cache.size} roles`,
                        inline: true
                    },
                    {
                        name: 'Channel Count',
                        value: `${server.channels.cache.size} channels`,
                        inline: true
                    },
                    {
                        name: 'Members',
                        value: `${server.memberCount} members`,
                        inline: true
                    },
                    {
                        name: 'Bots',
                        value: `${members.filter((m) => m.user.bot).size} bots`,
                        inline: true
                    },
                    {
                        name: 'Humans',
                        value: `${members.filter((m) => !m.user.bot).size} humans`,
                        inline: true
                    }
                )
            interaction.reply({embeds: [serverEmbed]})
        } else if (interaction.options.getSubcommand() === 'bot') {
            const type = client.user.presence.activities[0].type
            const bot = interaction.guild.me
            const botEmbed = new MessageEmbed()
                .setAuthor(client.user.tag)
                .setColor(client.user.accentColor)
                .addFields(
                    {
                        name: 'id',
                        value: `${client.user.id}`,
                        inline: true
                    },
                    {
                        name: 'Created',
                        value: `<t:${Math.round(client.user.createdTimestamp / 1000)}:F> - <t:${Math.round(client.user.createdTimestamp / 1000)}:R>`,
                        inline: true
                    },
                    {
                        name: 'Joined',
                        value: `<t:${Math.round(bot.joinedTimestamp / 1000)}:F> - <t:${Math.round(bot.joinedTimestamp / 1000)}:R>`,
                        inline: true
                    },
                    {
                        name: 'Status',
                        value: `${client.user.presence.status}`,
                        inline: true
                    },
                    {
                        name: 'Activity',
                        value: `${client.user.presence.activities.length > 0 ? `${type.charAt(0).toUpperCase() + type.slice(1)} **${client.user.presence.activities[0].name}**` : 'None'}`,
                        inline: true
                    }
                )
            interaction.reply({embeds: [botEmbed]})
        }
    }
})
