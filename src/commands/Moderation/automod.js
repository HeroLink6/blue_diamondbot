const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('automod')
    .setDescription('create an automod rule!')
    .addSubcommand(command => command.setName('flagged-words').setDescription('add flagged words'))
    .addSubcommand(command => command.setName('spam-messages').setDescription('Block messages suspected to be spam'))
    .addSubcommand(command => command.setName('mention-spam').setDescription('Block messages containing a certain amount of metions').addIntegerOption(option => option.setName('number').setDescription('The number of mentions required to block a message').setRequired(true)))
    .addSubcommand(command => command.setName('keyword').setDescription('block a given keyword in the server').addStringOption(option => option.setName('word').setDescription('The word you want to block').setRequired(true))),
    async execute(interaction) {

        const { guild, options } = interaction;
        const sub = options.getSubcommand();

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `you don't have perms to setup automod in this server`, ephermal: true})

        switch (sub) {
            case 'flagged-words':

            await interaction.reply({ content: `Loading your automod rule...`});

            const rule = await guild.autoModerationRules.create({
                name: `Block profanity, sexual content, and slurs by Blue Diamond`,
                creatorId: '440205899898814496',
                enabled: true,
                eventType: 1,
                triggerType: 4,
                triggerMetadata:
                    {
                        presets: [1, 2, 3]
                    },
                    actions: [
                        {
                            type: 1,
                            metadata: {
                                channel: interaction.channel,
                                durationSeconds: 10,
                                custommessage: `this message was prevented by: Blue Diamond's auto moderation system`
                            }
                        }
                    ]
            }).catch(async err => {
                setTimeout(async () => {
                    console.log(err);
                    await interaction.editReply({ content: `${err}`});
                }, 2000)
            })

            setTimeout(async () => {
                if (!rule) return;

                const embed = new EmbedBuilder()
                .setColor("Blue")
                .setDescription(`:white_check_mark: Your Automod rule has been created - all swears will be stopped by Blue Diamond`)

                await interaction.editReply({ content: ``, embeds: [embed] });
            }, 3000)

            break;

            case 'keyword':

            await interaction.reply({ content: `Loading your automod rule...`});
            const word = options.getString('word');

            const rule2 = await guild.autoModerationRules.create({
                name: `Prevent the word ${word} from being used by Blue Diamond`,
                creatorId: '440205899898814496',
                enabled: true,
                eventType: 1,
                triggerType: 1,
                triggerMetadata:
                    {
                       keywordFilter: [`${word}`]
                    },
                    actions: [
                        {
                            type: 1,
                            metadata: {
                                channel: interaction.channel,
                                durationSeconds: 10,
                                custommessage: `this message was prevented by: Blue Diamond's auto moderation system`
                            }
                        }
                    ]
            }).catch(async err => {
                setTimeout(async () => {
                    console.log(err);
                    await interaction.editReply({ content: `${err}`});
                }, 2000)
            })

            setTimeout(async () => {
                if (!rule2) return;

                const embed2 = new EmbedBuilder()
                .setColor("Blue")
                .setDescription(`:white_check_mark: Your Automod rule has been created - all messages containing the word ${word} will be deleted`)

                await interaction.editReply({ content: ``, embeds: [embed2] });
            }, 3000)

            break;

            case 'spam-messages':

            await interaction.reply({ content: `Loading your automod rule...`});
            

            const rule3 = await guild.autoModerationRules.create({
                name: `Prevent spam messages by Blue Diamond`,
                creatorId: '440205899898814496',
                enabled: true,
                eventType: 1,
                triggerType: 3,
                triggerMetadata:
                    {
                       //mentionTotalLimit: number
                    },
                    actions: [
                        {
                            type: 1,
                            metadata: {
                                channel: interaction.channel,
                                durationSeconds: 10,
                                customMessage: `this message was prevented by: Blue Diamond's auto moderation system`
                            }
                        }
                    ]
            }).catch(async err => {
                setTimeout(async () => {
                    console.log(err);
                    await interaction.editReply({ content: `${err}`});
                }, 2000)
            })

            setTimeout(async () => {
                if (!rule3) return;

                const embed3 = new EmbedBuilder()
                .setColor("Blue")
                .setDescription(`:white_check_mark: Your Automod rule has been created - any messages suspected of spam will be deleted`)

                await interaction.editReply({ content: ``, embeds: [embed3] });
            }, 3000)

            break;

            case 'mention-spam':

            await interaction.reply({ content: `Loading your automod rule...`});
            const Number = options.getInteger('number');

            const rule4 = await guild.autoModerationRules.create({
                name: `Prevent spam mentions by Blue Diamond`,
                creatorId: '440205899898814496',
                enabled: true,
                eventType: 1,
                triggerType: 5,
                triggerMetadata:
                    {
                       mentionTotalLimit: Number
                    },
                    actions: [
                        {
                            type: 1,
                            metadata: {
                                channel: interaction.channel,
                                durationSeconds: 10,
                                customMessage: `this message was prevented by: Blue Diamond's auto moderation system`
                            }
                        }
                    ]
            }).catch(async err => {
                setTimeout(async () => {
                    console.log(err);
                    await interaction.editReply({ content: `${err}`});
                }, 2000)
            })

            setTimeout(async () => {
                if (!rule4) return;

                const embed4 = new EmbedBuilder()
                .setColor("Blue")
                .setDescription(`:white_check_mark: Your Automod rule has been created - all messages suspected of spam will be deleted`)

                await interaction.editReply({ content: ``, embeds: [embed4] });
            }, 3000)

        }
    }
}