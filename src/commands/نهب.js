const { isInCooldown, setCooldown } = require('../utils/cooldown.js');
const ms = require('ms'); // تأكد أنه موجود

module.exports = {
    name: 'نهب',
    description: 'Steal a random amount of money from another user',
    async execute(message, db, config, args) {
        const thiefId = message.author.id;

        if (isInCooldown('نهب', thiefId, config)) {
            const timeLeft = isInCooldown('نهب', thiefId, config);
            return message.reply(`يرجى الانتظار ${timeLeft} قبل استخدام الأمر مرة أخرى.`);
        }

        if (args.length < 1) {
            return message.reply('يرجى الإشارة إلى المستخدم الذي تريد نهبه.');
        }

        const targetUser = message.mentions.users.first();
        if (!targetUser) {
            return message.reply('يرجى الإشارة إلى مستخدم صالح.');
        }

        const targetId = targetUser.id;

        if (thiefId === targetId) {
            return message.reply('لا يمكنك نهب نفسك!');
        }

        // تحقق من وجود حماية مفعلة (شيلد)
        const shieldExpiry = await db.get(`shield_${targetId}`);
        if (shieldExpiry && shieldExpiry > Date.now()) {
            return message.reply('ما تقدر يا حرامي، معه حماية ههههههههههههههههـ');
        }

        // تحقق إذا الضحية تم نهبها مؤخراً
        const targetRobCooldown = await db.get(`robbedCooldown_${targetId}`);
        if (targetRobCooldown && targetRobCooldown > Date.now()) {
            const timeLeft = ms(targetRobCooldown - Date.now(), { long: true });
            return message.reply(`هذا الشخص تعرض للنهب مؤخرًا! حاول مرة أخرى بعد ${timeLeft}.`);
        }

        let thiefBalance = await db.get(`balance_${thiefId}`) || 0;
        let targetBalance = await db.get(`balance_${targetId}`) || 0;

        if (targetBalance <= 0) {
            return message.reply('لا يمتلك هذا المستخدم رصيداً كافياً للنهب.');
        }

        const stealPercentage = Math.random() * (0.5 - 0.1) + 0.1;
        const stealAmount = Math.round(targetBalance * stealPercentage);

        thiefBalance += stealAmount;
        targetBalance -= stealAmount;

        await db.set(`balance_${thiefId}`, thiefBalance);
        await db.set(`balance_${targetId}`, targetBalance);

        // كولداون للسارق
        setCooldown('نهب', thiefId, config.cooldowns['نهب']);

        // كولداون للضحية (نصف ساعة)
        const protectionTime = Date.now() + ms('20m');
        await db.set(`robbedCooldown_${targetId}`, protectionTime);

        message.reply(`لقد نهبت ${targetUser.tag} وسرقت $${stealAmount.toLocaleString()}! رصيدك الحالي هو $${thiefBalance.toLocaleString()}.`);

        try {
            await targetUser.send(`🚨 تم نهبك من قبل ${message.author.tag} وسرقت $${stealAmount.toLocaleString()}.\nرصيدك الحالي هو $${targetBalance.toLocaleString()}.`);
        } catch (error) {
            console.error(`❌ لا يمكن إرسال رسالة خاصة إلى ${targetUser.tag}.`);
        }
    }
};
