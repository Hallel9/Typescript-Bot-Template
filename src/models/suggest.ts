import mongoose from 'mongoose'
import {Snowflake} from 'discord.js'

const Schema = new mongoose.Schema({
    Guild: String,
    MessageID: String,
    Details: Array
})

export type SuggestType = {
    Guild: Snowflake
    MessageID: Snowflake
    Details: Array<string>
}

export default mongoose.model<SuggestType>('Suggestions', Schema, 'Suggestions')
