const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rps')
        .setDescription('Play a Game Of Rock Paper Scissors'),
    async execute(interaction, client) {
        const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
        
        const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('🗒️')
                    .setEmoji('🗒️')
                    .setStyle(ButtonStyle.Secondary)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('✊')
                    .setEmoji('✊')
                    .setStyle(ButtonStyle.Primary)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('✂️')
                    .setEmoji('✂️')
                    .setStyle(ButtonStyle.Danger)
            );

        await interaction.reply({ 
            content: '**בחר אופציה:**', 
            components: [button],
            ephemeral: false 
        });
    },
};
