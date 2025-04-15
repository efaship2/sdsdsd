const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const path = './stats.json';
const config = require('../../config.js');

if (!fs.existsSync(path)) {
    fs.writeFileSync(path, JSON.stringify({}, null, 2));
}

function readStats() {
    const rawData = fs.readFileSync(path);
    return JSON.parse(rawData);
}

function writeStats(data) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Check stats user')
        .addUserOption(option => 
            option.setName('user')
            .setDescription('Select a User')
            .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const stats = readStats();

        if (!stats[user.id]) {
            const embedNone1 = new EmbedBuilder()
            .setColor(config.ServerColor)
            .setDescription(`${user} **| לא נמצא כלום על המשתמש הזה**`)
            return interaction.reply({ embeds: [embedNone1] });
        }

        const userStats = stats[user.id];

        const totalVoiceTime = userStats.voiceTime || 0;
        const days = Math.floor(totalVoiceTime / (24 * 3600));
        const hours = Math.floor((totalVoiceTime % (24 * 3600)) / 3600);
        const minutes = Math.floor((totalVoiceTime % 3600) / 60);
        const seconds = totalVoiceTime % 60;

        const statsEmbed = new EmbedBuilder()
            .setColor(config.ServerColor)
            .setTitle(`${user.username} Stats`)
            .setThumbnail(user.displayAvatarURL())
            .setDescription(`${user} (${user.id}) \n\n __**Messages:**__ \n \`${userStats.messagesCount}\` \n **__Voice:__** \n **\`${days}\` Days, \`${hours}\` Hours, \`${minutes}\` Minutes, \`${seconds}\` Seconds.**`)
            .setFooter({ text: `Developer: CodyDEV`, iconURL: interaction.guild.iconURL({ dynamic: true })})
            .setTimestamp();

        await interaction.reply({ embeds: [statsEmbed] });
    },
};

module.exports.countMessage = (message) => {
    const stats = readStats();
    const userId = message.author.id;

    if (!stats[userId]) {
        stats[userId] = {
            messagesCount: 0,
            voiceTime: 0,
        };
    }

    stats[userId].messagesCount += 1;
    writeStats(stats);
};

module.exports.updateVoiceTime = (userId, sessionDuration) => {
    const stats = readStats();

    if (!stats[userId]) {
        stats[userId] = {
            messagesCount: 0,
            voiceTime: 0,
        };
    }

    stats[userId].voiceTime += sessionDuration;
    writeStats(stats);
};
