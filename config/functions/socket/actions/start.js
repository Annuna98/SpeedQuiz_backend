const express = require('express');
const app = express();

// Простенький генератор случайных чисел 1000000 < i < 9999999
// с проверкой на существующие ключи сессий
//принимает массив подключенный пользователей
//возвращает уникальное значение номера сессии, по которому будут подключаться все пользователи
const generateRandomSessionKey = (connectedUsers) => {
  // Лимиты чисел для генератора
  const min = 1000000;
  const max = 9999999;


  // Создаём новый Set с уникальными значениями sessionKey, которые уже используются на сервере
  const usedSessionKeys = new Set(connectedUsers.map((user) => user.sessionKey));

  let resultSessionKey = null;
  // Пока мы не установим resultSessionKey - цикл не закончится
  while (!resultSessionKey) {
    // Генерируем случайное число (sessionKey) в диапазоне min < i < max
    const sessionKeyToCheck = Math.round(Math.random() * (max - min) + min);

    // Проверяем, используется ли уже этот sessionKey на сервере
    if (!usedSessionKeys.has(sessionKeyToCheck)) {
      // Если не используется - устанавливаем resultSessionKey,
      // после чего цикл while завершается
      resultSessionKey = sessionKeyToCheck;
    }
  }

  return resultSessionKey;
};

module.exports = async (user, data, connectedUsers) => {
  const { gameId } = data;
    //
    // for (d in user){
    //   console.log("user: " + d);
    // }
    // console.log("sessionKey: " + user.sessionKey);

  // Проверяем, прислал ли нам клиент id игры
  if (!gameId) {
    // Отправляем клиенту ошибку
    user.socket.emit('started', JSON.stringify({
      success: false,
      error: 'NO GAME ID'
    }));

    return;
  }

  // Получаем игру по gameId (если такая есть)
  //находим в базе данных ид нашей игры
  const game = await strapi
    .query('game')
    .findOne({
      id: gameId
    });



  // Проверяем, вернула ли нам база данную игру
  //если такой игры в базе нет, то ошибка
  if (!game) {
    // Отправляем клиенту ошибку
    user.socket.emit('started', JSON.stringify({
      success: false,
      error: 'NO GAME'
    }));

    // Заканчиваем функцию
    return;
  }

  // Генерируем новый sessionKey для запуска игры
  const sessionKey = generateRandomSessionKey(connectedUsers);

  // Устанавливаем эту сессию для пользователя
  user.sessionKey = sessionKey;

  // Добавляем новую сессию в базу данных
  const session = await strapi
    .query('session')
    .create({
      game: gameId,
      key: user.sessionKey
    });


  console.log('Your session key right now: ' + user.sessionKey);


  //отправляем пользователю ключ данной сессии
  user.socket.emit('getSession', user.sessionKey);


  console.log('User started session:', JSON.stringify(session));

  // Отправляем пользователю информацию об этой сессии
  user.socket.emit('started', JSON.stringify({
    success: true,
    data: session
  }));
};
