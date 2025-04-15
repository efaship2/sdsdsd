const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = './claimsTicket.json';
const config = require('../../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove-claims')
        .setDescription('[Admin] Remove Claims')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount')
                .setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.roles.cache.has(config.ManagementRoleID)) {
            return interaction.reply({ content: `**You Do Not Have The Required Permissions To Use This Command.**`, ephemeral: true });
        }

        const user = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');

        let claimsData = JSON.parse(fs.readFileSync(path));

        if (claimsData[user.id]) {
            claimsData[user.id].amount = Math.max(0, claimsData[user.id].amount - amount);

            fs.writeFileSync(path, JSON.stringify(claimsData, null, 2));

            await interaction.reply({ content: `\`✍\` **Removed To ${user} \`${amount}\` Claims**`, ephemeral: true });
        } else {
            await interaction.reply({ content: `\`✍\` ${user} **Not Found In The Claims**`, ephemeral: true });
        }
    }
};