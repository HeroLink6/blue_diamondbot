const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('rocket-launch')
    .setDescription('launch a rocket to mars!'),
    async execute (interaction) {

        const responses = [
            ":rocket: Your rocket made it to mars safely!",
            ":exclamation: Your rocket exploded on the way...",
            
        ]
        
        const randomMessage = responses[ Math.floor(Math.random() * responses.length)];
        
        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(randomMessage)

        await interaction.reply({ embeds: [embed]});
    }
}