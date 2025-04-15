const { EmbedBuilder } = require('@discordjs/builders');
const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../config.js');

const inviteCountPath = path.join(__dirname, '../../../inviteCount.json');

function loadInviteCounts() {
    if (!fs.existsSync(inviteCountPath)) {
        fs.writeFileSync(inviteCountPath, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(inviteCountPath, 'utf8'));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invites')
        .setDescription('Check Invites For a User.')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('Select a User')
                .setRequired(false)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const inviteCounts = loadInviteCounts();

        const userData = inviteCounts[user.id];
        const joins = userData ? userData.joins || 0 : 0;
        const lefts = userData ? userData.lefts || 0 : 0;

        const embed = new EmbedBuilder()
        .setColor(config.ServerColor2)
        .setTitle(`${user.username}'s Invites `)
        .setDescription(`${user} **currently has \`${joins}\` invites. (\`${joins}\` Joins, \`${lefts}\` Lefts)**`)
        .setFooter({ text: `Developer: CodyDEV`, iconURL: config.ServerIcon })
        .setTimestamp()

        await interaction.reply({
            embeds: [embed],
        });
    },
};