const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('This purges channel messages')
    .addIntegerOption(option => option.setName('amount').setDescription(`The amount of messages you want to delete`).setMinValue(1).setMaxValue(100).setRequired(true)),
    async execute (interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return interaction.reply({ content: 'You do not have the Manage Messages permission!', ephemeral: true});

        let number = interaction.options.getInteger('amount');

        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`:white_check_mark: Deleted ${number} messages`)

        await interaction.channel.bulkDelete(number)

         await interaction.reply({ embeds: [embed] });
    }
}