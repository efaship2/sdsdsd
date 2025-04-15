const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
const config = require('../../config.js');

const timeoutsFilePath = path.join(__dirname, '../../../timeoutsTickets.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove-timeout')
        .setDescription('[Admin] Remove The Timeout For a User')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('Select a User')
                .setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.roles.cache.has(config.ManagementRoleID)) {
            return interaction.reply({ content: `**You Do Not Have The Required Permissions To Use This Command.**`, ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const userId = user.id;

        let timeouts = {};
        if (fs.existsSync(timeoutsFilePath)) {
            timeouts = JSON.parse(fs.readFileSync(timeoutsFilePath));
        }

        if (!timeouts[userId]) {
            return await interaction.reply({ content: `\`🚫\` **${user} Does Not Have An Active Timeout.**`, ephemeral: true });
        }

        delete timeouts[userId];
        fs.writeFileSync(timeoutsFilePath, JSON.stringify(timeouts));

        await interaction.reply({ content: `\`🚫\` **Timeout For ${user} Has Been Removed.**`, ephemeral: true });
    }
};
