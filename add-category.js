const fs = require('fs');
const path = require('path');
const { PermissionsBitField, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const filePath = path.join(__dirname, '../../../ticketCategorys.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-category')
        .setDescription('[Admin] Add a New Ticket Category')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('Name Of The New Category')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Description Of The Category (Optional)')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('emoji')
                .setDescription('Emoji For The Category (Optional)')
                .setRequired(false)
        ),
    
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({ content: `**You Do Not Have The Required Permissions To Use This Command.**`, ephemeral: true });
        }

        const newCategory = interaction.options.getString('category');
        const description = interaction.options.getString('description') || null;
        const emoji = interaction.options.getString('emoji') || null;

        let ticketCategories = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        if (ticketCategories.categories.some(cat => cat.name === newCategory)) {
            const embedExists = new EmbedBuilder()
                .setColor('Red')
                .setDescription(`**The Category \`${newCategory}\` Already Exists.**`);
            
            return interaction.reply({ embeds: [embedExists], ephemeral: true });
        }

        ticketCategories.categories.push({ name: newCategory, description, emoji });

        fs.writeFileSync(filePath, JSON.stringify(ticketCategories, null, 2));

        const embedSuccess = new EmbedBuilder()
            .setColor('Green')
            .setDescription(`> **Successfully Added The New Category: \`${newCategory}\`**`);

        return interaction.reply({ embeds: [embedSuccess], ephemeral: true });
    }
};