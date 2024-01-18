const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('developers')
    .setDescription("View the bot's Developers!"),
    async execute (interaction) {

        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle('Bot Developers')
        .setDescription('The developer that coded me is: Hero Link 6!')

        const userButton = new ButtonBuilder()
        .setLabel('Join The Official Support Server!')
        .setStyle(ButtonStyle.Link)
        .setURL('https://discord.gg/wPTJDecaqH')

        const row = new ActionRowBuilder()
        .addComponents(userButton)

        await interaction.reply({ embeds: [embed], components: [row] });

    }
}