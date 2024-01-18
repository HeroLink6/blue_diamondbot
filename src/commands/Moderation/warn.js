const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a user!')
    .addUserOption(option => option.setName('user').setDescription('The user you want to warn').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The reason for warning').setRequired(true)),
    async execute (interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `You don't have permissions to warn a user!`, ephemeral: true});

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');

        const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle('You have been warned!')
        .setDescription(`You have been warned in ${interaction.guild.name} | Reason: ${reason}`)

        await user.send({ embeds: [embed]}).catch(err => {
           return interaction.reply({ content: `There was a problem sending a Direct message to the user. Please contact them and let them know they have been warned`, ephemeral: true})
        });

        await interaction.reply({ content: `I have successfully warned ${user}`, ephemeral: true});
    }
}