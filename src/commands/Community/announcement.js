const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('create an announcement!')
    .addChannelOption(option => option.setName('channel').setDescription('the channel you want to post announcements in!').setRequired(true))
    .addStringOption(option => option.setName('title').setDescription('The title of your embed').setRequired(true))
    .addStringOption(option => option.setName('description').setDescription('The description of your embed').setRequired(true)),
    async execute (interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `You don't have the permissions to create an announcement!`, ephemeral: true});
        
        const channel = interaction.options.getChannel('channel');
        const title = interaction.options.getString('title');
        const description = interaction.options.getString('description');
        const footer = interaction.options.getString('footer');

        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle(`${title}`)
        .setDescription(`${description}`)

        await channel.send({ embeds: [embed]}).catch(err => {
            return interaction.reply(`I had a problem posting the announcement in ${channel}!`);
        })
        await interaction.reply({ content: `:white_check_mark: I successfully posted the announcement in #${channel}!`, ephemeral: true})
    }
}