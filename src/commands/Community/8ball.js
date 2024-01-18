const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Ask the magic 8ball anything!')
    .addStringOption(option => option.setName('question').setDescription('the question you want to ask the 8ball!').setRequired(true)),
    async execute (interaction) {

        const responses = [
            "As I see it, Yes",
            "My reply is No",
            "Reply Hazy, Please try Again",
            "Signs point to Yes",
            "Outlook Good",
            "Outlook not so Good",
            "Very Doubtful",
            "Yes, Definitely",
            "Don't count on it",
            "It is certain",
            "It is decidedly So",
            "Better not tell you Now",
            "Yes",
            "Concentrate, and Try Again",
            "Ask Again Later",
            "Cannot Predict now",
            "My sources say No",
            "Without a Doubt",
            "You May Rely on it",
            "Most Likely",
        ]

        const question = interaction.options.getString('question')
        const randomMessage = responses[ Math.floor(Math.random() * responses.length)];
        
        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(`${interaction.user} Asked the Magic 8Ball ${question} The Answer is: ${randomMessage}`)

        await interaction.reply({ embeds: [embed]});
    }
}