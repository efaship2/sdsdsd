const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('paypal-cal')
        .setDescription('Paypal Cal')
        .addNumberOption(option => 
            option.setName('amount')
                .setDescription('Type Amount')
                .setRequired(true)
        ),
    async execute(interaction) {
        const amount = interaction.options.getNumber('amount');

        const feePercentage = 2.9 / 100;
        const fixedFee = 1.20;

        const feeAmount = (amount * feePercentage) + fixedFee;
        const amountAfterFee = amount - feeAmount;

        const amountBeforeFee = (amount + fixedFee) / (1 - feePercentage);

        const embed = new EmbedBuilder()
            .setColor(config.ServerColor)
            .setTitle(`תשלום בפייפאל \`💵\``)
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
