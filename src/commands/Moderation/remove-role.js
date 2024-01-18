const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role-remove')
        .setDescription('Removes A Role From A User!')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageRoles)
        .addUserOption(option =>
            option.setName('member')
                .setDescription('The Member To Remove The Role From!')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The Role To Remove From The Member!')
                .setRequired(true)),
    async execute(interaction) {
        const member = interaction.options.getMember('member');
        const role = interaction.options.getRole('role');

        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`:white_check_mark: Role ${role.name} Removed From ${member.user.username}`)

        try {
            await member.roles.remove(role);
            await interaction.reply({ embeds: [embed]});
        } catch (error) {
            await interaction.reply({ content: `Failed Remove Role!. Error: ${error.message}`, ephemeral: true});
        }

    }
};