const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../config.js');
const { EmbedBuilder } = require('@discordjs/builders');

const inviteCountPath = path.join(__dirname, '../../../inviteCount.json');

function loadInviteCounts() {
    if (!fs.existsSync(inviteCountPath)) {
        fs.writeFileSync(inviteCountPath, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(inviteCountPath, 'utf8'));
}

function saveInviteCounts(counts) {
    fs.writeFileSync(inviteCountPath, JSON.stringify(counts, null, 2));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-invites')
        .setDescription('[Admin] Add Invites To a User')
        .addUserOption(option => option.setName('user').setDescription('Select a User').setRequired(true))
        .addIntegerOption(option => option.setName('amount').setDescription('Amount To Add').setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.roles.cache.has(config.ManagementRoleID)) {
            return interaction.reply({ content: `**You Do Not Have The Required Permissions To Use This Command.**`, ephemeral: true });
        }
        const user = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');

        if (amount <= 0) {
            await interaction.reply(`${user} Not have invites.`);
            return;
        }

        const inviteCounts = loadInviteCounts();

        if (!inviteCounts[user.id]) {
            inviteCounts[user.id] = { joins: 0, lefts: 0 };
        }

        inviteCounts[user.id].joins += amount;
        saveInviteCounts(inviteCounts);

        const embed = new EmbedBuilder()
        .setColor(config.ServerColor2)
        .setTitle(`Add Invites`)
        .setDescription(`**Successfully Added \`${amount}\` Invites To <@${user.id}>.**`)
        .setFooter({ text: `Developer: CodyDEV`, iconURL: config.ServerIcon })
        .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};