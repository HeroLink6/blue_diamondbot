const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ReactionUserManager } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Times out a server member')
    .addUserOption(option => option.setName('user').setDescription('the user you want to time out').setRequired(true))
    .addStringOption(option => option.setName('duration').setRequired(true).setDescription('The duration of the timeout').addChoices(
        { name: '60 Seconds', value: '60' },
        { name: '2 Minutes', value: '120' },
        { name: '5 Minutes', value: '300' },
        { name: '10 Minutes', value: '600' },
        { name: '15 Minutes', value: '900' },
        { name: '20 Minutes', value: '1200' },
        { name: '30 Minutes', value: '1800' },
        { name: '45 Minutes', value: '2700' },
        { name: '1 Hour', value: '3600' },
        { name: '2 Hours', value: '7200' },
        { name: '3 Hours', value: '10800' },
        { name: '5 Hours', value: '18000' },
        { name: '10 Hours', value: '36000' },
        { name: '1 Day', value: '86400' },
        { name: '2 Days', value: '172800' },
        { name: '3 Days', value: '259200' },
        { name: '5 Days', value: '432000' },
        { name: '1 Week', value: '604800' },
    ))
    .addStringOption(option => option.setName('reason').setDescription('The reason for timing out the user')),
    async execute (interaction) {

        const timeUser = interaction.options.getUser('user');
        const timeMember = await interaction.guild.members.fetch(timeUser.id);
        const duration = interaction.options.getString('duration');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return await interaction.reply({ content: `You must have the moderate members perm to use this command!`, ephemeral: true});
        if (!timeMember) return await interaction.reply({ content: 'The user mentioned is no longer within the server', ephemeral: true});
        if (!timeMember.kickable) return await interaction.reply({ content: 'I cannot time out that user because they are either a higher role or member then me!', ephemeral: true});
        if (interaction.member.id === timeMember.id) return await interaction.reply({ content: 'You cannot time out yourself', ephemeral: true});
        if (timeMember.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'You cannot time out a person with the admin permisson', ephemeral: true});

        let reason = interaction.options.getString('reason') || 'No reason given';

        await timeMember.timeout(duration * 1000, reason);

        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(` :white_check_mark:  ${timeUser.tag} has been **timed out** for ${duration / 60} minute(s) | ${reason}`)

        const dmEmbed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(` :white_check_mark:  You have been timed out in ${interaction.guild.name}. You can check the status of your timeout in the server | ${reason}`)

        await timeMember.send({ embeds: [dmEmbed] }).catch(err => {
            return;
        })

        await interaction.reply({ embeds: [embed] });
    }
}