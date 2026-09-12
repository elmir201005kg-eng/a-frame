/**
 * Скрипт для создания bcrypt хэша пароля
 * Использование: node scripts/hash-password.js
 */

const readline = require('readline');
const bcrypt = require('bcryptjs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Введите пароль для хэширования: ', (password) => {
  const hash = bcrypt.hashSync(password, 10);
  console.log('\n✅ Хэш пароля:');
  console.log(hash);
  console.log('\n📝 Используйте этот хэш в SQL запросе для создания пользователя.\n');
  rl.close();
});
