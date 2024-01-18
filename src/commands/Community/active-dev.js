const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('active-dev-badge')
    .setDescription('See how to get the active dev badge!'),
    async execute (interaction) {

        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle('Active Dev Badge')
        .setDescription('To get the active developer badge, one of your bots must have executed a slash command in the last 30 days.')

        const devButton = new ButtonBuilder()
        .setLabel('Get the badge!')
        .setStyle(ButtonStyle.Link)
        .setURL('https://discord.com/developers/active-developer')

        const badgeButton = new ButtonBuilder()
        .setLabel('Article on requirements')
        .setStyle(ButtonStyle.Link)
        .setURL('https://support-dev.discord.com/hc/en-us/articles/10113997751447-Active-Developer-Badge')

        const row = new ActionRowBuilder()
        .addComponents(devButton, badgeButton)

        await interaction.reply({ embeds: [embed], components: [row]});
    }
}