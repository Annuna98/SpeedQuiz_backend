const actionsHandler = require('./actions');

const connectedUsers = [];

module.exports = () => {
  // Запускаем сокетное соединение на порту 3000
  const io = require('socket.io')(3000);

  // Ловим все попытки подключиться
  io.on('connection', (socket) => {
    // При подключении - создаём новый объект пользователя,
    // куда будем складывать важные для нас данные
    console.log("user connected");
    const currentUser = {
      socket: socket,
      sessionKey: null
    };

    // Добавляем объект пользователя в общий массив пользователей
    connectedUsers.push(currentUser);

    // Ловим разрыв данного соединения
    socket.on('disconnect', () => {
      console.log("user disconnected");
      // Ищем индекс пользователя в массиве
      const sessionIndex = connectedUsers.findIndex((session) => {
        return session.socket === socket;
      });

      // Если индекс больше -1 (т.е. существует) -
      // удаляем пользователя из массива подключённых юзеров
      if (sessionIndex > -1) {
        connectedUsers.splice(sessionIndex, 1);
      }
    });

    // Навешиваем обработчик на действия (экшены) с клиентов
    actionsHandler(socket, currentUser, connectedUsers);



  });

  return io;
};
