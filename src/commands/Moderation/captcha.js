const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const capSchema = require('../../Schemas/capSchema');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('captcha')
    .setDescription('Set up the captcha verification system')
    .addSubcommand(command => command.setName('setup').setDescription('Setup the captcha verification system').addRoleOption(option => option.setName('role').setDescription('The role you want to be given on verification').setRequired(true)).addStringOption(option => option.setName('captcha').setDescription('The captcha text you want in the image').setRequired(true)))
    .addSubcommand(command => command.setName('disable').setDescription('Disable the captcha verification system')),
    async execute (interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `You don't have permissons to do this!`, ephemeral: true});

        const Data = await capSchema.findOne({ Guild: interaction.guild.id});

        const { options } = interaction;
        const sub = options.getSubcommand();

        switch (sub) {
            case 'setup':

            if (Data) return await interaction.reply({ content: 'the captcha system is already setup here!', ephemeral: true});
            else {

                const role = options.getRole('role');
                const captcha = options.getString('captcha');

                await capSchema.create({
                    Guild: interaction.guild.id,
                    Role: role.id,
                    Captcha: captcha,
                })

                const embed = new EmbedBuilder()
                .setColor("Blue")
                .setDescription(':white_check_mark: The Captcha system has been setup!')

                await interaction.reply({ embeds: [embed] });
            }

            break;

            case 'disable':

            if (!Data) return await interaction.reply({ content: 'There is no Captcha verification system setup here!', ephemeral: true});
            else {
                await capSchema.deleteMany({ Guild: interaction.guild.id});

                const embed = new EmbedBuilder()
                .setColor("Blue")
                .setDescription(':white_check_mark: The Captcha system has been disabled!')

                await interaction.reply({ embeds: [embed]})
            }
        }
    }
}
