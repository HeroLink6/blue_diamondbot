const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('user-ids')
    .setDescription(`Get the ID of a discord user!`)
    .addUserOption(option => option.setName('user').setDescription('The user that you want to get their ID from').setRequired(true)),
    async execute (interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `You do not have the perms to see ${userID}'s user ID!`, ephemeral: true});

        const userID = interaction.options.getUser('user');

        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`${userID}'s user ID is: ${userID.id}`)

        await interaction.reply({ embeds: [embed]});
    }
}