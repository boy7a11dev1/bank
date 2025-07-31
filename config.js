const ms = require('ms');

module.exports = {
  token: 'token', // التوكن
  allowedChannelId: '1400487613936439376', // ايدي روم خاص للبنك
  voiceChannelId: '1400216268186976509', // ← غيّر هذا إلى ID الروم الصوتي

  // اوقات التجميد لكل امر
  cooldowns: {
    راتب: ms('5m'),
    حظ: ms('5m'),
    استثمار: ms('5m'),
    تداول: ms('5m'),
    قرض: ms('5m'),
    توب: ms('5s'),
    نرد: ms('5m'),
    قمار: ms('5m'),
    نهب: ms('5m'),
    حماية: ms('5m'),
    يومي: ms('5m'),
    شراء: ms('15s'),
    منازل: ms('15s'),
    شركات: ms('15s'),
    شراء_شركة: ms('15s'),
    بيع_شركة: ms('15s'),
  },

  startingSalary: 500,
  investmentMultiplier: 1.1,
  transferTaxRate: 0.20,
  gambleMultiplier: 1.5,
  rentInterval: ms('1d'),

  // إعدادات قائمة الأوامر
  commandsListTitle: '📜 قائمة الأوامر الخاصة بالبوت 📜',
  commandsListDescription: 'هذه هي جميع الأوامر المتاحة في البوت:',
  embedColor: '#8a8a8a',

  // إعدادات قائمة أغنى الأشخاص بالسيرفر
  topPlayersLimit: 6,
  topPlayersTitle: '🏆 قائمة أغنى الأشخاص بالسرفر 🏆',
  topPlayersDescription: 'هؤلاء هم أغنى الأشخاص بالسرفر حسب رصيدهم الحالي:',
  topPlayersEmbedColor: '#595959',

  // إعدادات الحظ
  luckMinAmount: 500,
  luckMaxAmount: 2500,

  // إعدادات الحماية
  shieldMaxHours: 5,
  shieldCostPerHour: 50000,

  // الوظائف
  jobTitles: [
    { name: 'ملك', cost: 50000, salary: 5000 },
    { name: 'امير', cost: 45000, salary: 4500 },
    { name: 'طيار', cost: 40000, salary: 4000 },
    { name: 'قاضي', cost: 35000, salary: 3500 },
    { name: 'مبرمج', cost: 30000, salary: 3000 },
    { name: 'دكتور', cost: 30000, salary: 3000 },
    { name: 'مهندس', cost: 25000, salary: 2500 },
    { name: 'معلم', cost: 20000, salary: 2000 },
    { name: 'جندي', cost: 15000, salary: 1500 },
    { name: 'طباخ', cost: 10000, salary: 1000 },
    { name: 'رسام', cost: 8000, salary: 800 },
  ],

  pointsPerWin: 5,
  pointsPerLoss: -2,
  baseSalary: 10000,

  houses: [
    { price: 100000, income: 50000, ownerId: null },
    { price: 100000, income: 50000, ownerId: null },
    { price: 100000, income: 50000, ownerId: null },
    { price: 100000, income: 50000, ownerId: null },
    { price: 100000, income: 50000, ownerId: null },
  ],
};
