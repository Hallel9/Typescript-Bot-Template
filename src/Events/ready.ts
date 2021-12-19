import chalk from 'chalk'
import {client} from '..'
import {Event} from '../Structures/Event'

export default new Event('ready', () => {
    console.log(chalk.green.bold.underline('Ready!'))
})
