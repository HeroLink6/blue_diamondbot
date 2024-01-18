const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('hug')
    .setDescription('Hug another user!')
    .addUserOption(option => option.setName('user').setDescription('the user you want to hug').setRequired(true)),
    async execute (interaction) {

        const target = interaction.options.getUser('user')
        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle('Hugs!')
        .setDescription(`${target} was hugged by ${interaction.user}!`)
        
        await interaction.reply({ embeds: [embed]});
    }
    
}