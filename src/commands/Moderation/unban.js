const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a banned user')
    .addUserOption(option => option.setName('user').setDescription('the user you want to unban').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('the reason why the user is unbanned')),
    async execute(interaction, client) {

        const userID = interaction.options.getUser('user');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply({ content: "You don't have permission to unban members in this server!", ephemeral: true});
        if (interaction.member.id === userID) return await interaction.reply({ content: "You cannot unban yourself", ephemeral: true});

        let reason = interaction.options.getString('reason');
        if (!reason) reason = 'No reason given';

        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`:white_check_mark:  ${userID} has been unbanned | ${reason}`)

        await interaction.guild.bans.fetch()
        .then(async bans => {

            if (bans.size == 0) return await interaction.reply({ content: "There is no one banned from this server", ephemeral: true})
            let bannedID = bans.find(ban => ban.user.id == userID);
            if (!bannedID) return await interaction.reply({ content: "That user is not banned from this server", ephemeral: true})

            await interaction.guild.bans.remove(userID).catch(err => {
                return interaction.reply({ content: "I cannot unban this user"})
            })
        })

        await interaction.reply({ embeds: [embed] });
    }
}