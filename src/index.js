require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection, Events, AuditLogEvent, AttachmentBuilder, ActionRowBuilder, ActivityType, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, ComponentType, ChannelType } = require('discord.js');

const fs = require('fs');
const client = new Client({ intents: [Object.keys(GatewayIntentBits)] });

client.commands = new Collection();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
    client.login(process.env.token)
})();

//autorole
const autorole = require('./Schemas/autorole');
client.on(Events.GuildMemberAdd, async member => {
    const data = await autorole.findOne({ Guild: member.guild.id });
    if (!data) return;
    else {
        try {
            await member.roles.add(data.Role);
        } catch (e) {
            return;
        }
    }
})

//reactionrole
const reactSchema = require("./Schemas/reactionrole");
client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.customId === "reactionrole") {
        const guild = interaction.guild.id;
        const message = interaction.message.id;
        const reactchannel = interaction.channel.id;
 
        const reactData = await reactSchema.findOne({
            Guild: guild,
            Message: message,
            Channel: reactchannel
        })
 
        if (!reactData) {
            return;
        } else if (reactData) {
            //Role ID
            const ROLE_ID = reactData.Role;
            //try add/remove role
            try {
                const targetMember = interaction.member;
                const role = interaction.guild.roles.cache.get(ROLE_ID);
                if (!role) {
                  interaction.reply({
                    content: 'Role not found.',
                    ephemeral: true
                  });
                }
                if (targetMember.roles.cache.has(ROLE_ID)) {
                    targetMember.roles.remove(role).catch(err => {console.log(err)});
                  interaction.reply({
                    content: `Removed the role ${role} from ${targetMember}.`,
                    ephemeral: true
                  });
                } else {
                  await targetMember.roles.add(role).catch(err => {console.log(err)});;
                  interaction.reply({
                    content: `Added the role ${role} to ${targetMember}.`,
                    ephemeral: true
                  });
                }
              } catch (error) {
                //catch the error
                console.log(error);
                interaction.reply('An error occurred while processing the command.');
            }
        }
    }
})

//Captcha system
const { CaptchaGenerator } = require('captcha-canvas');
const capSchema = require('./Schemas/capSchema');
let guild;

client.on(Events.GuildMemberAdd, async member => {

    const Data = await capSchema.findOne({ Guild: member.guild.id});
    if (!Data) return;
    else {

        const cap = Data.Captcha;

        const captcha = new CaptchaGenerator()
        .setDimension(150, 450)
        .setCaptcha({ text: `${cap}`, size: 60, color: "green"})
        .setDecoy({ opacity: 0.5})
        .setTrace({ color: "green" })

        const buffer = captcha.generateSync();

        const Attachment = new AttachmentBuilder(buffer, { name: `captcha.png` });

        const embed = new EmbedBuilder()
        .setColor("Blue")
        .setImage(`attachment://captcha.png`)
        .setTitle(`Solve the captcha to verify in ${member.guild.name}`)
        .setFooter({ text: 'Use the button below to submit your captcha answer!'})

        const capButton = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('capButton')
            .setLabel(`Submit`)
            .setStyle(ButtonStyle.Danger)
        )

        const capModal = new ModalBuilder()
        .setTitle('Submit Captcha Answer')
        .setCustomId('capModal')

        const answer = new TextInputBuilder()
        .setCustomId('answer')
        .setRequired(true)
        .setLabel('Your captcha answer')
        .setPlaceholder('Submit what you think the captcha is! if you get it wrong you can try again')
        .setStyle(TextInputStyle.Short)

        const firstActionRow = new ActionRowBuilder().addComponents(answer);

        capModal.addComponents(firstActionRow);

        const msg = await member.send({ embeds: [embed], files: [Attachment], components: [capButton] }).catch(err => {
            return;
        })

        const collector = msg.createMessageComponentCollector()

        collector.on('collect', async i => {
            if (i.customId === 'capButton') {
                i.showModal(capModal);
            }
        })

        guild = member.guild;

    }
})

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isModalSubmit()) return;
    else {

        if (!interaction.customId === 'capModal') return;
        const Data = await capSchema.findOne({ Guild: guild.id});

        const answer = interaction.fields.getTextInputValue('answer');
        const cap = Data.Captcha;

        if (answer != `${cap}`) return await interaction.reply({ content: 'That answer was wrong! Try again.', ephemeral: true});
        else {
            const roleID = Data.Role;

            const capGuild = await client.guilds.fetch(guild.id);
            const role = await capGuild.roles.cache.get(roleID);

            const member = await capGuild.members.fetch(interaction.user.id);

            await member.roles.add(role).catch(err => {
               return interaction.reply({ content: 'There was an error verifying you. Please contact server staff to proceed', ephemeral: true});
            })
                
            return await interaction.reply({ content: `You have been verified within ${capGuild.name}`});

        }
    }
})

// Leave Message //
const welcomeschema = require('../src/Schemas/welcome')
const roleschema = require('../src/Schemas/autorole')
client.on(Events.GuildMemberRemove, async (member, err) => {
 
    const leavedata = await welcomeschema.findOne({ Guild: member.guild.id });
 
    if (!leavedata) return;
    else {
 
        const channelID = leavedata.Channel;
        const channelwelcome = member.guild.channels.cache.get(channelID);
 
        const embedleave = new EmbedBuilder()
        .setColor("DarkBlue")
        .setTitle(`${member.user.username} has left`)
        .setDescription( `> ${member} has left the Server`)
        .setFooter({ text: `👋 Cast your goobyes`})
        .setTimestamp()
        .setAuthor({ name: `👋 Member Left`})
        .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081275127850864640/largeblue.png')
 
        const welmsg = await channelwelcome.send({ embeds: [embedleave]}).catch(err);
        welmsg.react('👋');
    }
})
 
// Welcome Message //
client.on(Events.GuildMemberAdd, async (member, err) => {
 
    const welcomedata = await welcomeschema.findOne({ Guild: member.guild.id });
 
    if (!welcomedata) return;
    else {
 
        const channelID = welcomedata.Channel;
        const channelwelcome = member.guild.channels.cache.get(channelID)
        const roledata = await roleschema.findOne({ Guild: member.guild.id });
 
        if (roledata) {
            const giverole = await member.guild.roles.cache.get(roledata.Role)
 
            member.roles.add(giverole).catch(err => {
                console.log('Error received trying to give an auto role!');
            })
        }
 
        const embedwelcome = new EmbedBuilder()
         .setColor("DarkBlue")
         .setTitle(`${member.user.username} has arrived\nto the Server!`)
         .setDescription( `> Welcome ${member} to the Sevrer!`)
         .setFooter({ text: `👋 Get cozy and enjoy :)`})
         .setTimestamp()
         .setAuthor({ name: `👋 Welcome to the Server!`})
         .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081275127850864640/largeblue.png')
 
        const embedwelcomedm = new EmbedBuilder()
         .setColor("DarkBlue")
         .setTitle('Welcome Message')
         .setDescription( `> Welcome to ${member.guild.name}!`)
         .setFooter({ text: `👋 Get cozy and enjoy :)`})
         .setTimestamp()
         .setAuthor({ name: `👋 Welcome to the Server!`})
         .setThumbnail('https://cdn.discordapp.com/attachments/1080219392337522718/1081275127850864640/largeblue.png')
 
        const levmsg = await channelwelcome.send({ embeds: [embedwelcome]});
        levmsg.react('👋');
        member.send({ embeds: [embedwelcomedm]}).catch(err => console.log(`Welcome DM error: ${err}`))
 
    } 
})

// Advanced Help Menu //
 
client.on(Events.InteractionCreate, async interaction => {
 
    const helprow2 = new ActionRowBuilder()
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
 
    if (!interaction.isStringSelectMenu()) return;
    if (interaction.customId === 'selecthelp') {
        let choices = "";
 
        const centerembed = new EmbedBuilder()
        .setColor('Green')
        .setTimestamp()
        .setTitle('> Help Center')
        .setAuthor({ name: `🧩 Help Toolbox` })
        .setFooter({ text: `🧩 Help Center` })
        .addFields({ name: `• Help Center`, value: `> Displays this menu.` })
        .addFields({ name: `• Tickets`, value: `> Get information on tickets.` })
        .addFields({ name: `• Commands`, value: `> Get information on commands.` })
 
        interaction.values.forEach(async (value) => {
            choices += `${value}`;
 
            if (value === 'helpcenter') {
 
                await interaction.update({ embeds: [centerembed] });
            }
 
            if (value === 'ticketpage') {
 
                const ticketembed = new EmbedBuilder()
                    .setColor('Green')
                    .setTimestamp()
                    .setTitle('> Ticket Page')
                    .setAuthor({ name: `🧩 Help Toolbox` })
                    .setFooter({ text: `🧩 Ticket Page` })
                    .addFields({ name: `• Tickets`, value: `> Tickets are a cool way of contacting \n> support, to create on use **/ticket**! (Coming soon!)` });
 
                await interaction.update({ embeds: [ticketembed] });
            }
 
            if (value === 'commands') {
 
                const commandpage1 = new EmbedBuilder()
                .setColor('Green')
                .setTimestamp()
                .setTitle('> Commands Page 1')
                .setAuthor({ name: `🧩 Help Toolbox` })
                .setFooter({ text: `🧩 Commands: Page 1` })
                .addFields({ name: `• /help`, value: `> Opens up an advanced help guide!` })
                .addFields({ name: `• /Launch`, value: `> Launch a rocket to mars!` })
                .addFields({ name: `• /automod`, value: `> Different types of automod rules to create` })
                .addFields({ name: `• /warn`, value: `> Warn a user` })
                .addFields({ name: `• /kick`, value: `> Kick a user` })
 
                const commandpage2 = new EmbedBuilder()
                .setColor('Green')
                .setTimestamp()
                .setTitle('> Commands Page 2')
                .setAuthor({ name: `🧩 Help Toolbox` })
                .setFooter({ text: `🧩 Commands: Page 2` })
                .addFields({ name: `• /ban`, value: `> Ban a member` })
                .addFields({ name: `• /timeout`, value: `> Time out a member` })
                .addFields({ name: `• /moderate-name`, value: `> Moderate a nickname` })
                .addFields({ name: `• /8ball`, value: `> Ask the magic 8Ball anyhting!` })
                .addFields({ name: `• /say`, value: `> Make the bot say something!` })
 
                const commandbuttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('helpcenterbutton')
                    .setLabel('Help Center')
                    .setStyle(ButtonStyle.Success),
 
                    new ButtonBuilder()
                    .setCustomId('spacer')
                    .setLabel('<>')
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Secondary),
 
                    new ButtonBuilder()
                    .setCustomId('pageleft')
                    .setLabel('◀')
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Success),
 
                    new ButtonBuilder()
                    .setCustomId('pageright')
                    .setLabel('▶')
                    .setStyle(ButtonStyle.Success)
                )
 
                const commandbuttons1 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('helpcenterbutton1')
                        .setLabel('Help Center')
                        .setStyle(ButtonStyle.Success),
 
                        new ButtonBuilder()
                        .setCustomId('spacer1')
                        .setLabel('<>')
                        .setDisabled(true)
                        .setStyle(ButtonStyle.Secondary),
 
                        new ButtonBuilder()
                        .setCustomId('pageleft1')
                        .setLabel('◀')
                        .setDisabled(false)
                        .setStyle(ButtonStyle.Success),
 
                        new ButtonBuilder()
                        .setCustomId('pageright1')
                        .setDisabled(true)
                        .setLabel('▶')
                        .setStyle(ButtonStyle.Success)
                    )
 
                interaction.update({ embeds: [commandpage1], components: [commandbuttons] });
                const commandsmessage = interaction.message;
                const collector = commandsmessage.createMessageComponentCollector({ componentType: ComponentType.Button });
 
                collector.on('collect', async i => {
 
                    if (i.customId === 'spacer') {
 
                        return;
 
                    }
 
                    if (i.customId === 'helpcenterbutton') {
 
                        await i.update({ embeds: [centerembed], components: [helprow2] });
 
                    }
 
                    if (i.customId === 'pageleft') {
 
                        await i.update({ embeds: [commandpage1], components: [commandbuttons] });
 
                    }
 
                    if (i.customId === 'pageright') {
 
                        await i.update({ embeds: [commandpage2], components: [commandbuttons1] });
 
                    }
 
                    if (i.customId === 'helpcenterbutton1') {
 
                        await i.update({ embeds: [centerembed], components: [helprow2] });
 
                    }
 
                    if (i.customId === 'pageright1') {
 
                        await i.update({ embeds: [commandpage2], components: [commandbuttons1] });
 
                    }
 
                    if (i.customId === 'pageleft1') {
 
                        await i.update({ embeds: [commandpage1], components: [commandbuttons] });
 
                    }
                })
            }
        })
    }
})

