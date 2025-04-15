const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const config = require('../../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reset-all-xp')
        .setDescription('[Admin] Reset All XP'),
    
    async execute(interaction) {
        if (!interaction.member.roles.cache.has(config.ManagementRoleID)) {
            return interaction.reply({ content: `**You Do Not Have The Required Permissions To Use This Command.**`, ephemeral: true });
        }
        const filePath = './xpLevels.json';

        const defaultData = {};

        fs.writeFile(filePath, JSON.stringify(defaultData, null, 2), (err) => {
            if (err) {
                console.error('Error writing to file', err);
                return;
            }

            return interaction.reply({ content: '**Reset All XP**', ephemeral: true });
        });
    },
};