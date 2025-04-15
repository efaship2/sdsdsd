const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Intents, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Get The Avatar Of a User')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('Select a User')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;

        const avatarEmbed = new EmbedBuilder()
            .setTitle(`${user.username}'s Avatar`)
            .setDescription(`**__Requested By:__** ${interaction.user}`)
            .setImage(`${user.displayAvatarURL({ format: 'png', dynamic: true })}`)

        await interaction.reply({ embeds: [avatarEmbed] });
    },
};