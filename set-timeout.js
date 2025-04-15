const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
const config = require('../../config.js');

const timeoutsFilePath = path.join(__dirname, '../../../timeoutsTickets.json');

const convertToMilliseconds = (timeString) => {
    const timeUnit = timeString.slice(-1);
    const timeValue = parseInt(timeString.slice(0, -1), 10);
    
    switch (timeUnit) {
        case 'd': return timeValue * 24 * 60 * 60 * 1000;
        case 'h': return timeValue * 60 * 60 * 1000;
        case 'm': return timeValue * 60 * 1000;
        default: throw new Error('Invalid time format');
    }
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-timeout')
        .setDescription('[Admin] Set Timeout For Ticket')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('User')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('time')
                .setDescription('Timeout Duration (1d, 2h, 4m)')
                .setRequired(true)),
    
    async execute(interaction) {
        if (!interaction.member.roles.cache.has(config.ManagementRoleID)) {
            return interaction.reply({ content: `**You Do Not Have The Required Permissions To Use This Command.**`, ephemeral: true });
        }
        
        const user = interaction.options.getUser('user');
        const timeString = interaction.options.getString('time');
        const timeoutDuration = convertToMilliseconds(timeString);
        
        const userId = user.id;

        let timeouts = {};
        if (fs.existsSync(timeoutsFilePath)) {
            timeouts = JSON.parse(fs.readFileSync(timeoutsFilePath));
        }

        timeouts[userId] = Date.now() + timeoutDuration;
        fs.writeFileSync(timeoutsFilePath, JSON.stringify(timeouts));
        
        await interaction.reply({ content: `\`🚫\` ${user} **Received Timeout For \`${timeString}\`**`, ephemeral: true });
    }
};