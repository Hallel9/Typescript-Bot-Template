import {Command} from '../../Structures/Command'

export default new Command({
    name: 'ping',
    description: 'Pong!',
    userPermissions: ['ADMINISTRATOR'],
    run: ({interaction, client}) => {
        interaction.reply({content: 'Pong!' + ` ${client.ws.ping}`})
    }
})
