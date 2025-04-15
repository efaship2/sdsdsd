const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../config.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blacklist')
        .setDescription('[Admin] Add Blacklist')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('Select a User')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Type Reason')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('proof1')
                .setDescription('Image 1')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('proof2')
                .setDescription('Image 2')
                .setRequired(true)),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');
        const proof1 = interaction.options.getString('proof1');
        const proof2 = interaction.options.getString('proof2');

        const blacklistChannel = interaction.guild.channels.cache.get(config.BlacklistChannel);
        if (!blacklistChannel) {
            return;
        }

        const embed = new EmbedBuilder()
        .setColor(config.ServerColor2)
        .setAuthor({ name: `${config.ServerName} | Blacklist`, iconURL: config.ServerIcon })
        .setDescription(`**__User__**\n**Mention:** ${user} **| ID:** ${user.id}\n\n__**Reason**__\n${reason}`)
        .setFooter({ text: `Developer: CodyDEV`, iconURL: config.ServerIcon })
        .setThumbnail(config.ServerIcon)
        .setTimestamp();

        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel('Proof 1')
            .setURL(proof1)
        )
        .addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel('Proof 2')
            .setURL(proof2)
        )

        await blacklistChannel.send({ embeds: [embed], components: [button] });
        await interaction.reply({ content: `**Blacklist Added To ${user}.**`, ephemeral: true });
    },
};
