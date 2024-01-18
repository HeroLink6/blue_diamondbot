const { SlashCommandBuilder, StringSelectMenuBuilder, EmbedBuilder, ActionRowBuilder } = require('discord.js');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get some help.'),
    async execute(interaction) {
 
        const helprow1 = new ActionRowBuilder()
        .addComponents(
 
            new StringSelectMenuBuilder()
            .setMinValues(1)
            .setMaxValues(1)
            .setCustomId('selecthelp')
            .setPlaceholder('• Select a menu')
            .addOptions(
                {
                    label: '• Help Center',
                    description: 'Navigate to the Help Center.',
                    value: 'helpcenter',
                },
 
                {
                    label: '• Tickets',
                    description: 'Navigate to the Tickets page.',
                    value: 'ticketpage'
                },
 
                {
                    label: '• Commands',
                    description: 'Navigate to the Commands help page.',
                    value: 'commands',
                },
            ),
        );
 
        const centerembed = new EmbedBuilder()
        .setColor('Green')
        .setTimestamp()
        .setTitle('> Help Center')
        .setAuthor({ name: `🧩 Help Toolbox`})
        .setFooter({ text: `🧩 Help Center`})
        .addFields({ name: `• Help Center`, value: `> Displays this menu.`})
        .addFields({ name: `• Tickets`, value: `> Get information on tickets.`})
        .addFields({ name: `• Commands`, value: `> Get information on commands.`})
 
        await interaction.reply({ embeds: [centerembed], components: [helprow1] });
    }
}
