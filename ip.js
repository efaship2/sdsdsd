const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const config = require('../../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ip')
        .setDescription('Check The IP And Server Status'),
    async execute(interaction, client) {
        let ipData;
        try {
            const filePath = path.join(__dirname, '../../../fivemIpAdress.json');
            const data = fs.readFileSync(filePath, 'utf8');
            ipData = JSON.parse(data);
        } catch (error) {
            console.error('Error reading the fivemIpAdress.json file:', error);
            return;
        }

        let serverStatus1 = '🔴';
        let serverStatus2 = 'Server Is Offline';
        try {
            const response = await axios.get(`http://${config.FivemAddressIP}:${config.FivemPort}/info.json`, {
                timeout: 2000
            });

            const response2 = await axios.get(`http://${config.FivemAddressIP}:${config.FivemPort}/players.json`, {
                timeout: 2000
            });

            if (response.status === 200 && response.data) {
                const players = response2.data.length;
                const maxPlayers = response.data.vars ? response.data.vars.sv_maxClients : 'Unknown';

                serverStatus1 = '🟢';
                serverStatus2 = `Online, ${players}/${maxPlayers}`;
            }
        } catch (error) {
            console.error('Error fetching server status:', error);
        }

        const embed = new EmbedBuilder()
            .setColor(config.ServerColor)
            .setAuthor({
                name: `${config.ServerName} | Server Status`,
                iconURL: interaction.guild.iconURL({ dynamic: true })
            })
            .setDescription(
                `${serverStatus1} **__Status:__ \`${serverStatus2}\`**\n` +
                `🐌 **__FiveM:__ \`${ipData.FivemIpAdress}\`**\n` +
                `🎙️ **__Mumble:__ \`Mumble, VOICE CHAT ON\`**\n\n`
            )
            .setFooter({
                text: `Developer: tzuri1`,
                iconURL: interaction.guild.iconURL({ dynamic: true })
            })
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setTimestamp();

        interaction.reply({ embeds: [embed] });
    },
};
