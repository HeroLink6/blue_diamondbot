const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member in the server')
    .addUserOption(option => option.setName('user').setDescription('the user you want to ban').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('the reason why the user is banned')),
    async execute(interaction, client) {

        const users = interaction.options.getUser('user');
        const ID = users.id;
        const banUser = client.users.cache.get(ID)

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply({ content: "You don't have permission to ban members in this server!", ephemeral: true});
        if (interaction.member.id === ID) return await interaction.reply({ content: "You cannot ban yourself", ephemeral: true});

        let reason = interaction.options.getString('reason');
        if (!reason) reason = 'No reason given';

        const dmEmbed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`:white_check_mark:  You have been banned form **${interaction.guild.name}** | ${reason}`)

        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`:white_check_mark:  ${banUser.tag} has been banned | ${reason}`)

        await interaction.guild.bans.create(banUser.id, {reason}).catch(err => {
            return interaction.reply({ content: "I cannot ban that member!", ephemeral: true})
        })

        await banUser.send({ embeds: [dmEmbed] }).catch(err => {
            return;
        })

        await interaction.reply({ embeds: [embed] });
    }
}