const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('membercount')
    .setDescription('Show how many members are in your server!'),
    async execute (interaction) {

        const member1 = interaction.guild.memberCount;
        const bot = interaction.guild.members.cache.filter(member => member.user.bot).size;

        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle('Member/Bot Count')
        .setDescription(`**Member Count:** ${member1 - bot} \n \n**Bot Count:** ${bot} \n \n**Total Members:** ${member1}`)

        await interaction.reply({ embeds: [embed]});
    }
}