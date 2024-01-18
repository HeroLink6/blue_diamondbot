const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role-add')
        .setDescription('Add A Role To A Member!')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageRoles)
        .addUserOption(option =>
            option.setName('member')
                .setDescription('The Member To Add The Role To!')
                .setRequired(true))
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The Role To Add To The Member!')
                .setRequired(true)),
    async execute(interaction) {
        const member = interaction.options.getMember('member');
        const role = interaction.options.getRole('role');

        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`:white_check_mark: Role ${role.name} Added To ${member.user.username}.`)

        try {
            await member.roles.add(role);
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            await interaction.reply({ content: `Failed To Add Role To. Error: ${error.message}`, ephemeral: true});
        }

    }
};