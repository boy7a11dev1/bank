const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { QuickDB } = require('quick.db');
const path = require('path');
const fs = require('fs');
const config = require('./config.js');
const cooldownUtil = require('./src/utils/cooldown.js');
const companies = require('./src/commands/companiesData');
const jobCommand = require('./src/commands/job.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ],
    partials: [Partials.Channel, Partials.Message]
});

const db = new QuickDB();

// إعداد مجلد النسخ الاحتياطي
const backupFilePath = path.join(__dirname, 'data', 'backup.json');
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}

// النسخ الاحتياطي كل 5 دقائق
setInterval(async () => {
    try {
        const allData = await db.all();
        fs.writeFileSync(backupFilePath, JSON.stringify(allData, null, 2), 'utf-8');
    } catch (err) {
        console.error('[❌] Failed to save backup:', err);
    }
}, 5 * 60 * 1000);

client.once('ready', async () => {
    try {
        for (const company of companies) {
            company.owner = await db.get(`company_${company.id}_owner`) || null;
            company.price = await db.get(`company_${company.id}_price`) || company.price;
        }

        console.log(`
        $$$$$$$$\ $$\       $$$$$$\ $$$$$$$$\ $$$$$$$$\ 
        $$  _____|$$ |      \_$$  _|\__$$  __|$$  _____|
        $$ |      $$ |        $$ |     $$ |   $$ |      
        $$$$$\    $$ |        $$ |     $$ |   $$$$$\    
        $$  __|   $$ |        $$ |     $$ |   $$  __|   
        $$ |      $$ |        $$ |     $$ |   $$ |      
        $$$$$$$$\ $$$$$$$$\ $$$$$$\    $$ |   $$$$$$$$\ 
        \________|\________|\______|   \__|   \________|
        `);
        console.log(`Bot is Ready! ${client.user.tag}!`);
        console.log(`Code by boy7a11`);

        // فقط إظهار البث
        client.user.setPresence({
            activities: [{
                name: 'Elite',
                type: 1,
                url: 'https://twitch.tv/your_channel' // ← غيّرها لقناتك لو حبيت
            }],
            status: 'online'
        });

    } catch (error) {
        console.error('Error during initialization:', error);
    }
});

// تحميل الأوامر
client.commands = new Map();
client.commands.set(jobCommand.name, jobCommand);

const commandFiles = fs.readdirSync(path.join(__dirname, 'src', 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    try {
        const command = require(`./src/commands/${file}`);
        client.commands.set(command.name, command);
    } catch (error) {
        console.error(`Error loading command ${file}:`, error);
    }
}

// معالج الرسائل
client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (message.channel.id !== config.allowedChannelId) return;

    const args = message.content.trim().split(/ +/);
    const commandName = args.shift();

    console.log(`Received command: "${commandName}" with args: ${args}`);

    if (client.commands.has(commandName)) {
        const command = client.commands.get(commandName);

        if (cooldownUtil.isInCooldown(command.name, message.author.id, config)) {
            return message.reply(`يرجى الانتظار قبل استخدام أمر ${command.name} مرة أخرى.`);
        }

        try {
            await command.execute(message, db, config, args);
            cooldownUtil.setCooldown(command.name, message.author.id, config.cooldowns[command.name]);
        } catch (error) {
            console.error(`Error executing command ${command.name}:`, error);
            message.reply('حدث خطأ أثناء تنفيذ هذا الأمر.');
        }
    }
});

client.login(config.token).catch(error => {
    console.error('Error logging in:', error);
});
