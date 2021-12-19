import * as Discord from 'discord.js'
import {CommandType} from '../typings/Command'
import {glob} from 'glob'
import {promisify} from 'util'
import {RegisterCommandOptions} from '../typings/Client'
import {Event} from './Event'
const globPromise = promisify(glob)
import {config} from 'dotenv'
config()
export class ExtendedClient extends Discord.Client {
    commands: Discord.Collection<string, CommandType> = new Discord.Collection()
    constructor(options: Discord.ClientOptions) {
        super(options)
    }
    start() {
        this.registerModules()
        this.login(process.env.botToken)
    }
    async importFile(filePath: string) {
        return (await import(filePath))?.default
    }
    registerCommands({commands, guildId}: RegisterCommandOptions) {
        if (guildId) {
            this.guilds.cache.get(guildId)?.commands.set(commands)
            console.log(`Registering commands to ${guildId}`)
        } else {
            this.guilds.cache.forEach((g) => g.commands.set(commands))
            console.log(`Registering commands to all guilds`)
        }
    }
    async registerModules() {
        // Commands
        const slashCommands: Discord.ApplicationCommandDataResolvable[] = []
        const commandFiles = await globPromise(`${__dirname}/../Commands/*/*{.ts,.js}`)
        commandFiles.forEach(async (filePath) => {
            const command: CommandType = await this.importFile(filePath)
            if (!command.name) return
            console.log(command)

            this.commands.set(command.name, command)
            slashCommands.push(command)
        })
        this.on('ready', () => {
            this.registerCommands({commands: slashCommands, guildId: process.env.guildId})
        })

        // Events
        const eventFiles = await globPromise(`${__dirname}/../Events/*{.ts,.js}`)
        eventFiles.forEach(async (filePath) => {
            const event: Event<keyof Discord.ClientEvents> = await this.importFile(filePath)
            this.on(event.event, event.run)
        })
    }
}
