module.exports = async (user, data, connectedUsers) => {
  const { sessionKey, nameId } = data;

  // Проверяем, подключён ли хотя бы один пользователь к этой сессии (создатель)
  if (!connectedUsers.find((user) => user.sessionKey == sessionKey)) {
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
      'game.questions',
      'game.questions.media'
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

  //если пользователь не админ, и не главный экран(для них имя - null),
  //то находим название команды в базе данных, если такой нет, то создаем название в базе
  // и отправляем пользователю информацию, иначе ошибка
  if (nameId != null){
    const name = await strapi
        .query('participant')
        .findOne({
          name: nameId
        });

    if (name){
      user.socket.emit('named', JSON.stringify({
        success: false,
        error: 'NAME IS ALREADY EXISTS'
      }));

      return ;
    }

    user.name = nameId;

    await strapi
        .query('participant')
        .create({
          name: nameId,
          session: JSON.stringify(session.id)
        });

      const participants = await strapi
          .query('session')
          .find({
              key: sessionKey
          }, [
              'participants'
          ])


      // if (user.sessionKey == sessionKey){
      //     user.to()
      // }

     for (const user of connectedUsers){
        if (user.sessionKey == sessionKey){
            user.socket.emit('named', JSON.stringify({
                success: true,
                data: participants
            }));
        }

     }


  }


  //console.log('User connected to session:', JSON.stringify(session));

  // Отправляем пользователю информацию об этой сессии
  user.socket.emit('joined', JSON.stringify({
    success: true,
    data: session
  }));

};
