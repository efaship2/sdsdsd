const fs = require('fs');
const path = require('path');
const { EmbedBuilder, PermissionsBitField, SlashCommandBuilder } = require('discord.js');
const filePath = path.join(__dirname, '../../../ticketCategorys.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove-category')
        .setDescription('[Admin] Remove a Ticket Category')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Name Of The Category')
                .setRequired(true)),
    
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({ content: `**You Do Not Have The Required Permissions To Use This Command.**`, ephemeral: true });
        }

        const categoryName = interaction.options.getString('name');

        let categoriesData;
        try {
            categoriesData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        } catch (error) {
            return;
        }

        const categoryIndex = categoriesData.categories.findIndex(cat => cat.name === categoryName);
        if (categoryIndex === -1) {
            const embedNotFound = new EmbedBuilder()
                .setColor('Red')
                .setDescription(`> **Category \`${categoryName}\` Not Found.**`);
            return interaction.reply({ embeds: [embedNotFound], ephemeral: true });
        }

        categoriesData.categories.splice(categoryIndex, 1);

        try {
            fs.writeFileSync(filePath, JSON.stringify(categoriesData, null, 2), 'utf-8');
            const embedFound = new EmbedBuilder()
                .setColor('#53d248')
                .setDescription(`> **\`${categoryName}\` Has Been Removed Successfully**`);
            interaction.reply({ embeds: [embedFound], ephemeral: true });
        } catch (error) {
            return;
        }
    },
};