const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('suggest')
    .setDescription('suggest something for us!')
    .addChannelOption(option => option.setName('channel').setDescription('The channel you want the suggestion to go in!').setRequired(true))
    .addStringOption(option => option.setName('suggestion').setDescription('The suggestion you want to suggest!').setRequired(true)),
    async execute (interaction) {

        const suggestion = interaction.options.getString('suggestion');
        const channel = interaction.options.getChannel('channel')

        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle('Suggestion:')
        .setDescription(`${suggestion}`)

        await interaction.reply({ content: `I posted the suggestion ${suggestion} in the #${channel} channel`, ephemeral: true});

        const message = await channel.send({ embeds: [embed]});
        await message.react('⬆️')
                .then(() => message.react('⬇️'))
    }
}