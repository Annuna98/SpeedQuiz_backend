const actionsHandler = require('./actions');
const express = require('express');
const app = express();
const path = require("path");

const connectedUsers = [];

module.exports = () => {
  // const fileDirectory = path.resolve(__dirname, '/../../../../speed_quiz_frontend/dist/SpeedQuiz');
  // app.use(express.static(fileDirectory));
  // app.get("*", (req, res) => {
  //   res.sendFile("index.html", {root: fileDirectory}, (err) => {
  //     res.end();
  //
  //     if (err) throw err;
  //   });
  // });
  // Запускаем сокетное соединение на порту 3000
  const io = require('socket.io')(3000);

  // Ловим все попытки подключиться
  io.on('connection', (socket) => {
    // При подключении - создаём новый объект пользователя,
    // куда будем складывать важные для нас данные
    console.log("user connected");
    const currentUser = {
      socket: socket,
      name: null,
      sessionKey: null,
      result: 0
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

    console.log("currentUser.sessionKey: " + currentUser.sessionKey);

  });

  return io;
};
