const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('paybox-cal')
        .setDescription('Paybox Cal')
        .addNumberOption(option => 
            option.setName('amount')
                .setDescription('Type Amount')
                .setRequired(true)
        ),
    async execute(interaction) {
        const amount = interaction.options.getNumber('amount');

        const feePercentage = 1.2 / 100;

        const feeAmount = amount * feePercentage;
        const amountAfterFee = amount - feeAmount;

        const amountBeforeFee = amount / (1 - feePercentage);

        const embed = new EmbedBuilder()
            .setColor(config.ServerColor)
            .setTitle(`תשלום בפייבוקס \`💵\``)
            .addFields(
                { name: 'לפני עמלה', value: `• ${amount.toFixed(2)}₪`, inline: true },
                { name: 'אחרי עמלה', value: `• ${amountBeforeFee.toFixed(2)}₪`, inline: false }
            )
            .setFooter({ text: `Developer: CodyDEV`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
