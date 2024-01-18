const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Make a poll for the community!')
    .addStringOption(option => option.setName('option1').setDescription('The first option').setRequired(true))
    .addStringOption(option => option.setName('option2').setDescription('The second option').setRequired(true))
    .addChannelOption(option => option.setName('channel').setDescription('the channel to post in').setRequired(true)),
    async execute (interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return await interaction.reply({ content: `You don't have permissions to run this command!`, ephemeral: true});

        const option1 = interaction.options.getString('option1')
        const option2 = interaction.options.getString('option2')
        const channel = interaction.options.getChannel('channel');

        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle('Poll!')
        .setDescription(`1. ${option1} or 2. ${option2}?`)

        const message = await channel.send({ embeds: [embed]});
        message.react('1️⃣')
            .then(() => message.react('2️⃣'))

        await interaction.reply({ content: `I have sent the poll for ${option1} or ${option2} in #${channel}!`, ephemeral: true})
    }
}