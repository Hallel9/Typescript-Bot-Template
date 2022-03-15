import chalk from 'chalk'
import {Event} from '../Structures/Event'

export default new Event('ready', (client) => {
    console.log(chalk.green.bold.underline('Ready!'))
    client.user.setActivity({name: 'With Typescript', type: 'PLAYING'})
})
