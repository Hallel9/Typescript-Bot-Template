import * as Discord from 'discord.js'
import { CommandType } from '../typings/Command'
import { glob } from 'glob'
import { promisify } from 'util'
import { RegisterCommandOptions } from '../typings/Client'
const globPromise = promisify(glob)
import { config } from 'dotenv'
import mongoose from 'mongoose'
import path from 'path'
import { lstat, readdir } from 'fs/promises'
config()
export class ExtendedClient extends Discord.Client {
    commands: Discord.Collection<string, CommandType> = new Discord.Collection()
    events: Discord.Collection<string, any> = new Discord.Collection()
    owners = []
    constructor(options: Discord.ClientOptions) {
        super(options)
    }
    start() {
        this.registerModules()
        this.login(process.env.botToken)
        this.connect()
        this.registerEvents('../Events')
    }
    async importFile(filePath: string) {
        return (await import(filePath))?.default
    }
    async registerCommands({ commands, guildId }: RegisterCommandOptions) {
        if (guildId) {
            const guild = await this.guilds.fetch(guildId)
            await guild.commands.set(commands).then((cmd) => {
                const getRoles = (commandName) => {
                    //@ts-ignore
                    const permissions = commands.find((x) => x.name === commandName).userPermissions
                    if (!permissions) return null
                    return guild.roles.cache.filter((x) => x.permissions.has(permissions) && !x.managed)
                }
                const fullPermissions = cmd.reduce((accumulator, x) => {
                    const roles = getRoles(x.name)
                    if (!roles) return accumulator

                    const permissions = roles.reduce((a, v) => {
                        return [
                            ...a,
                            {
                                id: v.id,
                                type: 'ROLE',
                                permission: true
                            }
                        ]
                    }, [])

                    return [
                        ...accumulator,
                        {
                            id: x.id,
                            permissions
                        }
                    ]
                }, [])
                guild.commands.permissions.set({ fullPermissions })
            })
            console.log(`Registering commands to ${guildId}`)
        } else {
            this.guilds.cache.forEach(async (g) => {
                await g.commands.set(commands).then((cmd) => {
                    const getRoles = (commandName) => {
                        //@ts-ignore
                        const permissions = commands.find((x) => x.name === commandName).userPermissions
                        if (!permissions) return null
                        return g.roles.cache.filter((x) => x.permissions.has(permissions) && !x.managed)
                    }
                    const fullPermissions = cmd.reduce((accumulator, x) => {
                        const roles = getRoles(x.name)
                        if (!roles) return accumulator

                        const permissions = roles.reduce((a, v) => {
                            return [
                                ...a,
                                {
                                    id: v.id,
                                    type: 'ROLE',
                                    permission: true
                                }
                            ]
                        }, [])

                        return [
                            ...accumulator,
                            {
                                id: x.id,
                                permissions
                            }
                        ]
                    }, [])
                    g.commands.permissions.set({ fullPermissions })
                })
            })
            console.log(`Registering commands to all guilds`)
        }
    }
    async registerModules() {
        // Commands
        const slashCommands: Discord.ApplicationCommandDataResolvable[] = []
        const commandFiles = await globPromise(`${__dirname}/../Commands/*/*{.ts,.js}`)
        commandFiles.forEach(async (filePath) => {
            const splitted = filePath.split('/')
            const directory = splitted[splitted.length - 2]
            const command: CommandType = await this.importFile(filePath)
            if (!command.name) return
            const properties = { directory, ...command }
            console.log(command)

            this.commands.set(command.name, properties)
            //@ts-ignore
            if (['MESSAGE', 'USER'].includes(command.type)) delete command.description
            slashCommands.push(command)
        })
        this.on('ready', () => {
            this.registerCommands({ commands: slashCommands, guildId: process.env.guildId })
        })
    }
    async registerEvents(dir: string) {
        const filePath = path.join(__dirname, dir)
        const files = await readdir(filePath)
        for (const file of files) {
            const stat = await lstat(path.join(filePath, file))
            if (stat.isDirectory()) this.registerEvents(path.join(dir, file))
            if (file.endsWith('.js') || file.endsWith('.ts')) {
                const { default: Event } = await import(path.join(dir, file))
                const event = new Event()
                this.events.set(event.getName(), event)
                this.on(event.getName(), event.run.bind(event, this))
            }
        }
    }
    connect() {
        if (!process.env.db) return
        mongoose
            .connect(process.env.db)
            .then(() => console.log(`Connected to mongodb!`))
            .catch((err) => console.log(`Error connecting to mongodb: ${err}`))
    }
}
