const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const autorole = require('../../Schemas/autorole');
 
const disable = new EmbedBuilder()
.setColor("Green")
.setDescription("The autorole has been disabled")
 
const noperms = new EmbedBuilder()
.setColor("Red")
.setDescription("You need to have Admin to use this command!")
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName("autorole-disable")
    .setDescription("Disable the Autorole"),
    async execute (interaction) {
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ embeds: [noperms], ephemeral: true})
 
        autorole.deleteMany({ Guild: interaction.guild.id }, async (err, data) => {
            await interaction.reply({ embeds: [disable], ephemeral: true})
        })
    }
}