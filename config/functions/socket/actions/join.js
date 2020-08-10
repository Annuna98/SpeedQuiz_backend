module.exports = async (user, data, connectedUsers) => {
  const { sessionKey } = data;


  for ( f in connectedUsers){
    console.log("connnected users: " + f);
  }



  // Проверяем, подключён ли хотя бы один пользователь к этой сессии (создатель)
  if (!connectedUsers.find((user) => user.sessionKey === sessionKey)) {
    // Отправляем клиенту ошибку
    user.socket.emit('joined', JSON.stringify({
      success: false,
      error: 'NO ACTIVE SESSION USERS'
    }));

    return;
  }

  // Получаем эту сессию из базы данных
  const session = await strapi
    .query('session')
    .findOne({
      key: data.sessionKey
    }, [
      // Вместе с самой сессией - получаем из базы связанную с ней игру и вопросы к ней
      'game',
      'game.questions'
    ]);

  

  // Проверяем, вернула ли нам база данную сессию
  if (!session) {
    // Отправляем клиенту ошибку
    user.socket.emit('joined', JSON.stringify({
      success: false,
      error: 'NO SESSION'
    }));

    // Заканчиваем функцию
    return;
  }

  // Устанавливаем эту сессию пользователю
  user.sessionKey = sessionKey;

  console.log('User connected to session:', JSON.stringify(session));

  // Отправляем пользователю информацию об этой сессии
  user.socket.emit('joined', JSON.stringify({
    success: true,
    data: session
  }));

};
