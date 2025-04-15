const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const fs = require('fs');
const config = require('../../config.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-shop')
        .setDescription('[Admin] Setup XP Shop')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Select a Channel')
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.roles.cache.has(config.ManagementRoleID)) {
            return interaction.reply({ content: `**You Do Not Have The Required Permissions To Use This Command.**`, ephemeral: true });
        }

        const channel = interaction.options.getChannel('channel');
        const rolesData = [
            { name: '💫 Special', cost: 15000, color: '#19c538' },
            { name: '🌊 Legend', cost: 20000, color: '#19c5ae' },
            { name: '🌠 Ultimate', cost: 30000, color: '#1990c5' },
            { name: '⚡ Points Pro', cost: 50000, color: '#dfe773' },
            { name: '🌟 Champion', cost: 75000, color: '#e7b373' },
            { name: '❄️ Snowflake', cost: 90000, color: '#75c6d2' },
            { name: '🌀 Elite', cost: 100000, color: '#b0f4ff' },
            { name: '🥂 Supreme', cost: 200000, color: '#010101' },
            { name: '💎 Points God', cost: 250000, color: '#16c6d2' },
        ];

        const roles = {};
        const guild = interaction.guild;

        for (const role of rolesData) {
            let createdRole = guild.roles.cache.find(r => r.name === role.name);
            
            if (!createdRole) {
                createdRole = await guild.roles.create({
                    name: role.name,
                    permissions: [],
                    reason: `Created For XP Shop`,
                    color: role.color,
                });
            }

            roles[role.name] = { id: createdRole.id, cost: role.cost };
        }

        fs.writeFileSync('./xpShopData.json', JSON.stringify(roles, null, 2));

        const descriptionLines = Object.entries(roles).map(([roleName, data], index) => {
            const roleTag = `<@&${data.id}>`;
            return `\`${index + 1}.\` ${roleTag} **- \`${data.cost.toLocaleString()}\`xp**`;
        });

        const shopEmbed = new EmbedBuilder()
            .setAuthor({ name: `${config.ServerName} - Store`, iconURL: config.ServerIcon })
            .setDescription(descriptionLines.join('\n'))
            .setThumbnail(config.ServerIcon)
            .setTimestamp()
            .setColor(config.ServerColor2);

        const buttons = [];
        Object.entries(roles).forEach(([roleName, data], index) => {
            buttons.push(
                new ButtonBuilder()
                    .setCustomId(`buy_${index}`)
                    .setLabel(`${roleName}`)
                    .setStyle('Secondary')
            );
        });

        const rows = [];
        while (buttons.length > 0) {
            const row = new ActionRowBuilder();
            row.addComponents(buttons.splice(0, 5)); 
            rows.push(row);
        }

        await channel.send({ embeds: [shopEmbed], components: rows });
    },
};
