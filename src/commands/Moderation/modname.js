const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('moderate-nickname')
    .setDescription("Moderate a member's nickname")
    .addUserOption(option => option.setName('user').setDescription('The use you want to moderate').setRequired(true)),
    async execute (interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply({ content: `You don't have permission to moderate user nicknames!`, ephemeral: true});

        await interaction.deferReply({ ephemeral: true});

        const { options } = interaction;
        const user = options.getUser('user');

        const member = await interaction.guild.members.fetch(user.id).catch(err => {});
        const tagline = Math.floor(Math.random() * 1000) + 1;

        const embed = new EmbedBuilder()
        .setColor('Blue')
        .setDescription(`:white_check_mark: I have set ${user.username}'s nickname to Moderated Nickname ${tagline}`);

        try {
            await member.setNickname(`Moderated Nickname ${tagline}`)
        } catch (e) {
            return await interaction.editReply({ content: `I was not able to moderate ${user}'s Nickname!`});
        }

        await interaction.editReply({ embeds: [embed] });
    }
}