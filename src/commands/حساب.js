const companies = require('./companiesData'); // تأكد من المسار الصحيح

module.exports = {
    name: 'حساب',
    description: 'عرض معلومات الحساب الشخصي أو حساب شخص آخر',
    async execute(message, db) {
        // إذا فيه منشن نستخدمه، وإلا نستخدم صاحب الرسالة
        const targetUser = message.mentions.users.first() || message.author;
        const userId = targetUser.id;

        // جلب البيانات من قاعدة البيانات
        const balance = await db.get(`balance_${userId}`) || 0;
        const loanAmount = await db.get(`loan_${userId}`) || 0;
        const userCompanies = await db.get(`user_${userId}_companies`) || [];

        // تحويل المعرفات إلى أسماء الشركات
        const companyNames = userCompanies.map(companyId => {
            const company = companies.find(c => c.id === companyId);
            return company ? company.name : 'شركة غير معروفة';
        }).join(', ');

        // بناء الرسالة
        const replyMessage = 
            `📄 معلومات الحساب لـ: ${targetUser.tag}\n` +
            `💰 الرصيد: $${balance.toLocaleString()}\n` +
            `🏦 القرض: $${loanAmount.toLocaleString()}\n` +
            `🏢 الشركات المملوكة: ${userCompanies.length > 0 ? companyNames : 'لا توجد شركات'}`;

        // إرسال الرد
        message.reply(replyMessage);
    }
};
