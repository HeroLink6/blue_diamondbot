const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('make the bot say something!')
    .addStringOption(option => option.setName('words').setDescription('The words you want the bot to say').setRequired(true)),
    async execute (interaction) {

        const phrase = interaction.options.getString('words')

        await interaction.reply({ content: `${phrase}`})
    }
}