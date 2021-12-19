import {ChatInputApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver, GuildMember, PermissionResolvable} from 'discord.js'
import {ExtendedClient} from '../Structures/Client'

export interface ExtendedInteraction extends CommandInteraction {
    member: GuildMember
}

interface RunOptions {
    client: ExtendedClient
    interaction: ExtendedInteraction
    args: CommandInteractionOptionResolver
}

type RunFunction = (options: RunOptions) => any

export type CommandType = {
    userPermissions?: PermissionResolvable[]
    guildOnly?: Boolean
    ownerOnly?: Boolean
    run: RunFunction
} & ChatInputApplicationCommandData
