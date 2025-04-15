const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const config = require('../../config.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('[Admin] Clear Messages')
        .addIntegerOption(option => 
            option
                .setName('amount')
                .setDescription('Number Of Messages To Delete (1-100).')
                .setRequired(true)
        ),
    async execute(interaction, client) {
        if (!interaction.member.roles.cache.has(config.StaffRoleId)) {
            return interaction.reply({ content: `**You Do Not Have The Required Permissions To Use This Command.**`, ephemeral: true });
        }

        const amount = interaction.options.getInteger('amount');

        if (amount <= 0 || amount > 100) {
            return interaction.reply({ content: '**You Can Only Delete Between 1-100 Messages.**', ephemeral: true });
        }

        try {
            const fetchedMessages = await interaction.channel.messages.fetch({ limit: amount });
            await interaction.channel.bulkDelete(fetchedMessages, true);

            const embed = new EmbedBuilder()
                .setColor(config.ServerColor)
                .setDescription(`${interaction.user} **Deleted \`${amount}\` Messages.**`);

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error deleting messages:', error);
            interaction.reply({ content: '**Please Try Again Later.**', ephemeral: true });
        }
    },
};