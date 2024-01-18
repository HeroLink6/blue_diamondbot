const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member from the server')
    .addUserOption(option => option.setName('user').setDescription('The user you want to kick').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for the kick')),
    async execute (interaction, client) {

        const kickUser = interaction.options.getUser('user');
        const kickMember = await interaction.guild.members.fetch(kickUser.id);
        const channel = interaction.channel;

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return await interaction.reply({ content: 'You do not have permission to kick members', ephemeral: true});
        if (!kickMember) return await interaction.reply({ content: 'The user mentioned is no longer within this server', ephemeral: true});
        if (!kickMember.kickable) return await interaction.reply({ content: 'I cannot kick this user because they have a higher role then me or you', ephemeral: true});

        let reason = interaction.options.getString('reason');
        if (!reason) reason = "No reason given.";

        const dmEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription(`:white_check_mark: You have been kicked from **${interaction.guild.name}** | ${reason}`)

        const embed = new EmbedBuilder()
        .setColor("Green")
        .setDescription(`:white_check_mark: ${kickUser.tag} has successfully been **kicked**`)

        await kickMember.send({ embeds: [dmEmbed] }).catch(err => {
            return;
        });

        await kickMember.kick({ reason: reason }).catch(err => {
            interaction.reply({ content: 'There was an error', ephemeral: true});
        });

        await interaction.reply({ embeds: [embed] })
    }
}