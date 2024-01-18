const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');

const { profileImage } = require('discord-arts');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user-info")
    .setDescription("view your or any member informations")
    .setDMPermission(false)
    .addUserOption((option) => option
      .setName("member")
      .setDescription("View member informations")
      .setRequired(true)
    ),
  /**
   * 
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    await interaction.deferReply();
    const memberOption = interaction.options.getMember("member");
    const member = memberOption || interaction.member;

    try {
      const fetchedMembers = await interaction.guild.members.fetch();

      const profileBuffer = await profileImage(member.id);
      const imageAttachment = new AttachmentBuilder(profileBuffer, { name: 'profile.png' });

      const joinPosition = Array.from(fetchedMembers
        .sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
        .keys())
        .indexOf(member.id) + 1;

      const topRoles = member.roles.cache
        .sort((a, b) => b.position - a.position)
        .map(role => role)
        .slice(0, 3);

      const userBadges = member.user.flags.toArray();

      const joinTime = parseInt(member.joinedTimestamp / 1000);
      const createdTime = parseInt(member.user.createdTimestamp / 1000);

      const Booster = member.premiumSince ? "<:discordboost:1136752072369377410>" : "✖";

      const avatarButton = new ButtonBuilder()
        .setLabel('Avatar')
        .setStyle(5)
        .setURL(member.displayAvatarURL());

      const bannerButton = new ButtonBuilder()
        .setLabel('Banner')
        .setStyle(5)
        .setURL((await member.user.fetch()).bannerURL() || 'https://example.com/default-banner.jpg');

      const row = new ActionRowBuilder()
        .addComponents(avatarButton, bannerButton);

      const Embed = new EmbedBuilder()
        .setAuthor({ name: `${member.user.tag} | General Information`, iconURL: member.displayAvatarURL() })
        .setColor("Blue")
        .setDescription(`On <t:${joinTime}:D>, ${member.user.username} Joined as the **${addSuffix(joinPosition)}** member of this guild.`)
        .setImage("attachment://profile.png")
        .addFields([
          { name: "Badges", value: `${addBadges(userBadges).join("")}`, inline: true },
          { name: "Booster", value: `${Booster}`, inline: true },
          { name: "Top Roles", value: `${topRoles.join("").replace(`<@${interaction.guildId}>`)}`, inline: false },
          { name: "Created", value: `<t:${createdTime}:R>`, inline: true },
          { name: "Joined", value: `<t:${joinTime}:R>`, inline: true },
          { name: "UserId", value: `${member.id}`, inline: false },
        ]);

      interaction.editReply({ embeds: [Embed], components: [row], files: [imageAttachment] });

    } catch (error) {
      interaction.editReply({ content: "An error in the code" });
      throw error;
    }
  }
};

function addSuffix(number) {
  if (number % 100 >= 11 && number % 100 <= 13)
    return number + "th";

  switch (number % 10) {
    case 1: return number + "st";
    case 2: return number + "nd";
    case 3: return number + "rd";
  }
  return number + "th";
}

function addBadges(badgeNames) {
  if (!badgeNames.length) return ["X"];
  const badgeMap = {
    "ActiveDeveloper": "<:activedeveloper:1190882976037339247>",
    "BugHunterLevel1": "<:discordbughunter1:1190883030722678815>",
    "BugHunterLevel2": "<:discordbughunter2:1190883049567699024>",
    "DiscordNitro": "<:discordnitro:1190883119314780261>",
    "PremiumEarlySupporter": "<:discordearlysupporter:1190883069591302235>",
    "PremiumBot": "<:PremiumBot:1190886579405852723>",
    "Partner": "<:discordpartner:1190883161282969730>",
    "Staff": "<:discordstaff:1190883183378583663>",
    "SupportsCommands": "<:SlashCommands:1190885385136525362>",
    "HypeSquadOnlineHouse1": "<:hypesquadbravery:1190883229796925460>", // bravery
    "HypeSquadOnlineHouse2": "<:hypesquadbrilliance:1190883256900526120>", // brilliance
    "HypeSquadOnlineHouse3": "<:hypesquadbalance:1190883213216841830>", // balance
    "Hypesquad": "<:hypesquadevents:1190883274923442176>",
    "CertifiedModerator": "<:olddiscordmod:1190883303193051136>",
    "UsesAutoMod": "<:automod:1190885948356046899>",
    "Username": "<:username:1190889477330178098>",
    "VerifiedDeveloper": "<:discordbotdev:1190883011353395210>",
  };

  return badgeNames.map(badgeName => badgeMap[badgeName] || '❔');
}
