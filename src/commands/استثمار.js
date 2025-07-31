module.exports = {
    name: 'استثمار',
    description: 'استثمر مبلغًا من رصيدك مع مخاطرة عالية وربح عالي!',
    async execute(message, db, config, args) {
        const userId = message.author.id;
        let currentBalance = await db.get(`balance_${userId}`) || 0;

        if (currentBalance <= 0) {
            return message.reply('❌ ليس لديك رصيد كافي للاستثمار.');
        }

        let investmentType = args[0];
        let investmentAmount;

        switch (investmentType) {
            case 'نص':
                investmentAmount = Math.round(currentBalance / 2);
                break;
            case 'ربع':
                investmentAmount = Math.round(currentBalance / 4);
                break;
            case 'كل':
            default:
                investmentAmount = currentBalance;
                break;
        }

        if (investmentAmount <= 0) {
            return message.reply('❌ لا يمكنك استثمار مبلغ صفر أو أقل.');
        }

        const isWin = Math.random() < 0.5;

        // مخاطرة أكبر حسب الرصيد، الحد الأعلى للخطورة = 10
        const riskFactor = Math.min(currentBalance / 10000, 10);

        let multiplier;
        if (isWin) {
            // يربح من 1.5x إلى 2.5x * riskFactor (كل ما زاد الرصيد، زاد الربح)
            multiplier = 1 + (Math.random() * 1.5 * riskFactor);
        } else {
            // يخسر من 1x إلى 2x * riskFactor (كل ما زاد الرصيد، زادت الخسارة)
            multiplier = 1 - (Math.random() * 2.0 * riskFactor);
        }

        const resultAmount = Math.round(investmentAmount * multiplier);
        const newBalance = currentBalance - investmentAmount + resultAmount;

        // لا تخليه يطيح تحت الصفر
        await db.set(`balance_${userId}`, Math.max(newBalance, 0));

        let messageContent;
        if (isWin) {
            const profit = resultAmount - investmentAmount;
            messageContent = `💰 **استثمار ناجح جدا!**\nربحت: \`$${profit.toLocaleString()}\`\nرصيدك السابق: \`$${currentBalance.toLocaleString()}\`\nرصيدك الحالي: \`$${Math.max(newBalance, 0).toLocaleString()}\``;
        } else {
            const loss = investmentAmount - resultAmount;
            messageContent = `💸 **استثمار خاسر جدا!**\nخسرت: \`$${loss.toLocaleString()}\`\nرصيدك السابق: \`$${currentBalance.toLocaleString()}\`\nرصيدك الحالي: \`$${Math.max(newBalance, 0).toLocaleString()}\``;
        }

        message.reply({
            content: messageContent,
            allowedMentions: { repliedUser: false }
        });
    }
};
