const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

// מחלקה לניהול מנוע בינה מלאכותית
class AIEngine {
  constructor() {
    // החלף את ה-API KEY שלך מ-Google AI Studio
    this.apiKey = "AIzaSyA4UQCfdQg-ltc3Zgs3EJ5ty079EphyaEI";
    
    try {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      console.log('🤖 מנוע הבינה המלאכותית אותחל בהצלחה');
    } catch (error) {
      console.error('❌ שגיאה באתחול Gemini AI:', error);
    }
  }

  // פונקציה לקבלת תשובה מהמנוע
  async generateResponse(prompt, conversationHistory = []) {
    try {
      // יצירת מודל מתוך ה-API
      const model = this.genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash",
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.7,
        }
      });

      // בניית פרומפט מלא עם היסטוריית שיחה
      let fullPrompt = `אתה עוזר בינה מלאכותית ידידותי ביותר. 
      אתה עוזר לענות על שאלות, לפתור בעיות, ולעזור בכל נושא שמבקשים ממך.
      
      הנה השאלה הנוכחית: ${prompt}`;

      // הוספת היסטוריית שיחה אם קיימת
      if (conversationHistory.length > 0) {
        fullPrompt += "\n\nהיסטוריית שיחה קודמת:";
        conversationHistory.forEach(msg => {
          fullPrompt += `\n${msg.role === 'user' ? 'משתמש' : 'AI'}: ${msg.content}`;
        });
      }

      // יצירת תשובה מהמודל
      const result = await model.generateContent(fullPrompt);
      const response = result.response.text();
      
      return this.formatResponse(response);
    } catch (error) {
      console.error('❌ שגיאה בקבלת תשובה מהבינה המלאכותית:', error);
      return "אירעה שגיאה בעת יצירת התשובה. נסה שוב מאוחר יותר.";
    }
  }

  // פונקציה לעיצוב התשובה לפני החזרתה
  formatResponse(text) {
    // עיצוב תשובה: מחליף קטעי קוד למבנה מתאים לדיסקורד
    return text
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '```$1\n$2```')  // שמירה על קטעי קוד
      .replace(/\*\*(.*?)\*\*/g, '**$1**');  // שמירה על טקסט מודגש
  }
}

// מחלקה לניהול שיחות
class ConversationManager {
  constructor() {
    // יצירת תיקיית צ'אטים אם לא קיימת
    this.CHATS_DIR = path.join(__dirname, 'chats');
    if (!fs.existsSync(this.CHATS_DIR)) {
      fs.mkdirSync(this.CHATS_DIR, { recursive: true });
    }
  }

  // קריאת שיחה מקובץ
  readConversation(userId) {
    const filePath = path.join(this.CHATS_DIR, `${userId}.json`);
    
    try {
      if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileData);
      }
    } catch (error) {
      console.error(`❌ שגיאה בקריאת שיחה: ${error.message}`);
    }
    
    // החזרת מבנה שיחה ריק
    return { 
      userId, 
      messages: [],
      createdAt: new Date().toISOString()
    };
  }

  // שמירת שיחה לקובץ
  saveConversation(userId, message, response) {
    const filePath = path.join(this.CHATS_DIR, `${userId}.json`);
    
    try {
      // קריאת שיחה קיימת או יצירת חדשה
      let conversation = this.readConversation(userId);
      
      // הוספת הודעות חדשות
      conversation.messages.push(
        { role: 'user', content: message, timestamp: new Date().toISOString() },
        { role: 'ai', content: response, timestamp: new Date().toISOString() }
      );
      
      // הגבלת מספר ההודעות לשמירה
      if (conversation.messages.length > 20) {
        conversation.messages = conversation.messages.slice(-20);
      }

      fs.writeFileSync(filePath, JSON.stringify(conversation, null, 2), 'utf8');
    } catch (error) {
      console.error(`❌ שגיאה בשמירת שיחה: ${error.message}`);
    }
  }

  // קבלת היסטוריית שיחה לשימוש ב-AI
  getConversationHistory(userId) {
    const conversation = this.readConversation(userId);
    return conversation.messages;
  }
}

// יצירת מופע של מנוע הבינה המלאכותית ומנהל השיחות
const aiEngine = new AIEngine();
const conversationManager = new ConversationManager();

// יצירת פקודת סלאש
module.exports = {
  data: new SlashCommandBuilder()
    .setName('ai')
    .setDescription('שאל את הבינה המלאכותית כל שאלה!')
    .addStringOption(option => 
      option.setName('שאלה')
        .setDescription('השאלה או הבקשה שלך')
        .setRequired(true)),
  
  async execute(interaction) {
    // הודעת טעינה ראשונית
    await interaction.deferReply();
    
    // קבלת השאלה והמשתמש
    const question = interaction.options.getString('שאלה');
    const userId = interaction.user.id;
    const username = interaction.user.username;
    
    try {
      // קבלת היסטוריית שיחה
      const conversationHistory = conversationManager.getConversationHistory(userId);
      
      // מחזיר הודעת "הבינה המלאכותית מקלידה..."
      const thinking = new EmbedBuilder()
        .setColor(0x6a11cb)
        .setTitle('🧠 מעבד את השאלה...')
        .setDescription('הבינה המלאכותית חושבת על תשובה...')
        .setFooter({ text: `שאלה מאת ${username}` });
      
      await interaction.editReply({ embeds: [thinking] });
      
      // קבלת תשובה מהבינה המלאכותית
      const response = await aiEngine.generateResponse(question, conversationHistory);
      
      // שמירת השיחה
      conversationManager.saveConversation(userId, question, response);
      
      // הגבלת אורך התשובה לתצוגה
      let displayResponse = response;
      if (displayResponse.length > 4000) {
        displayResponse = displayResponse.substring(0, 4000) + "...\n\n*התשובה קוצרה בשל מגבלות דיסקורד.*";
      }
      
      // יצירת אמבד עם התשובה
      const responseEmbed = new EmbedBuilder()
        .setColor(0x2575fc)
        .setTitle(`🤖 תשובה לשאלה`)
        .setDescription(displayResponse)
        .setTimestamp()
        .setFooter({ text: `שאלה מאת ${username}` });
      
      // שליחת האמבד לצ'אט
      await interaction.editReply({ embeds: [responseEmbed] });
      
    } catch (error) {
      console.error('❌ שגיאה בביצוע פקודת AI:', error);
      
      // הודעת שגיאה
      const errorEmbed = new EmbedBuilder()
        .setColor(0xdc3545)
        .setTitle('❌ שגיאה')
        .setDescription('אירעה שגיאה בעיבוד השאלה. נסה שוב מאוחר יותר.')
        .setTimestamp();
      
      await interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};