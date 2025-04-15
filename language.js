const { SlashCommandBuilder } = require('discord.js');

// שמירת השפות הזמינות במערך
const availableLanguages = ['english', 'hebrew'];

// מאגר נתונים פשוט לשמירת השפה הנבחרת לכל שרת
// במערכת אמיתית היית משתמש במסד נתונים כמו MongoDB
const serverLanguages = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('language')
        .setDescription('בחר את השפה בה הבוט ידבר בשרת')
        .addStringOption(option =>
            option.setName('language')
                .setDescription('השפה שאתה רוצה שהבוט ידבר')
                .setRequired(true)
                .addChoices(
                    { name: 'English', value: 'english' },
                    { name: 'עברית', value: 'hebrew' },
                )
        ),
    async execute(interaction) {
        const selectedLanguage = interaction.options.getString('language');
        
        // בדיקה שהשפה שנבחרה קיימת (למרות שדיסקורד כבר מגביל את הבחירות)
        if (!availableLanguages.includes(selectedLanguage)) {
            return interaction.reply({
                content: 'שפה לא חוקית. אנא בחר מהאפשרויות הזמינות.',
                ephemeral: true
            });
        }
        
        // שמירת השפה שנבחרה למזהה השרת
        const guildId = interaction.guild.id;
        serverLanguages.set(guildId, selectedLanguage);
        
        // שליחת הודעת אישור בהתאם לשפה שנבחרה
        if (selectedLanguage === 'english') {
            return interaction.reply({
                content: 'Bot language has been set to English for this server!',
                ephemeral: false
            });
        } else if (selectedLanguage === 'hebrew') {
            return interaction.reply({
                content: 'שפת הבוט הוגדרה לעברית עבור שרת זה!',
                ephemeral: false
            });
        }
    },
    
    // פונקציה נוספת שמאפשרת לקוד אחר לבדוק את השפה הנוכחית של שרת
    getLanguage(guildId) {
        // החזרת השפה השמורה או אנגלית כברירת מחדל
        return serverLanguages.get(guildId) || 'english';
    }
};