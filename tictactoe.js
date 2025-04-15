const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ttt',
    data: new SlashCommandBuilder()
        .setName('tictactoe')
        .setDescription('Play a Game Of Tic Tac Toe')
        .addUserOption(option =>
            option.setName('opponent')
                .setDescription('Select Your Opponent')
                .setRequired(true)),
    async execute(interaction) {
        const opponent = interaction.options.getUser('opponent');

        if (opponent.id === interaction.user.id) {
            return interaction.reply({ content: `**אין אפשרות לשחק לבד.**\n**תבחר יריב אחר.**`, ephemeral: true });
        }
        if (opponent.bot) {
            return interaction.reply({ content: `**אין אפשרות לשחק נגד בוט.**\n**בחר שחקן אמיתי.**`, ephemeral: true });
        }

        const board = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
        let currentPlayer = interaction.user;
        let winner = null;

        const createBoard = () => {
            const rows = [];
            for (let i = 0; i < 3; i++) {
                const row = new ActionRowBuilder();
                for (let j = 0; j < 3; j++) {
                    row.addComponents(
                        new ButtonBuilder()
                            .setCustomId((i * 3 + j).toString())
                            .setLabel(board[i * 3 + j])
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(board[i * 3 + j] !== '1️⃣' && board[i * 3 + j] !== '2️⃣' && board[i * 3 + j] !== '3️⃣' && board[i * 3 + j] !== '4️⃣' && board[i * 3 + j] !== '5️⃣' && board[i * 3 + j] !== '6️⃣' && board[i * 3 + j] !== '7️⃣' && board[i * 3 + j] !== '8️⃣' && board[i * 3 + j] !== '9️⃣')
                    );
                }
                rows.push(row);
            }
            return rows;
        };

        const createEmbed = () => {
            const embed = new EmbedBuilder()
                .setTitle('משחק איקס-עיגול')
                .setDescription(`**תור של:** ${currentPlayer}`);

            return embed;
        };

        const checkWinner = () => {
            const winConditions = [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6]
            ];

            for (const condition of winConditions) {
                const [a, b, c] = condition;
                if (board[a] === board[b] && board[b] === board[c]) {
                    return board[a];
                }
            }

            return board.includes('1️⃣') || board.includes('2️⃣') || board.includes('3️⃣') ||
                   board.includes('4️⃣') || board.includes('5️⃣') || board.includes('6️⃣') ||
                   board.includes('7️⃣') || board.includes('8️⃣') || board.includes('9️⃣') ? null : 'Tie';
        };

        const updateBoard = async () => {
            await interaction.editReply({
                embeds: [createEmbed()],
                components: createBoard()
            });
        };

        await interaction.reply({
            embeds: [createEmbed()],
            content: `${interaction.user} | ${opponent}\n**משחק איקס-עיגול התחיל!**`,
            components: createBoard()
        });

        const collector = interaction.channel.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 60000
        });

        collector.on('collect', async i => {
            if (i.user.id !== currentPlayer.id) {
                return i.reply({ content: `**זה לא התור שלך נא להמתין.**`, ephemeral: true });
            }

            const index = parseInt(i.customId);
            if (board[index] === '❌' || board[index] === '⭕') {
                return i.reply({ content: `**המקום הזה כבר תפוס!**`, ephemeral: true });
            }

            board[index] = currentPlayer.id === interaction.user.id ? '❌' : '⭕';
            winner = checkWinner();

            const embedEnd = new EmbedBuilder()
            .setTitle('משחק איקס-עיגול')
            .setDescription('**המשחק נגמר.**')

            if (winner) {
                collector.stop();
                return interaction.editReply({
                    embeds: [embedEnd],
                    content: winner === 'Tie' ? `${interaction.user} | ${opponent} \n **המשחק נגמר בתיקו!**` : `${interaction.user} | ${opponent} \n\n ${winner === '❌' ? interaction.user : opponent} **ניצח את המשחק הזה!**`,
                    components: []
                });
            }

            currentPlayer = currentPlayer.id === interaction.user.id ? opponent : interaction.user;
            await updateBoard();
            i.deferUpdate();
        });

        const embedEnd2 = new EmbedBuilder()
        .setTitle('משחק איקס-עיגול')
        .setDescription('**המשחק הסתיים ללא מנצח.**')


        collector.on('end', async collected => {
            if (!winner) {
                await interaction.editReply({
                    embeds: [embedEnd2],
                    content: `${interaction.user} | ${opponent}`,
                    components: []
                });
            }
        });
    }
};
