// Список всех экшенов
// (важно: названия экшенов должны совпадать с названиями файлов (с учётом регистра)
// обработчиков экшенов в текущей директории)
const actions = [
  'start',
  'create',
  'join',
  'raiseTheHand',
  'changePage',
  'validate'

];


module.exports = (socket, user, connectedUsers) => {

  // Пробегаемся циклом по всем экшенам и навешиваем обработчик на каждый из них
  actions.forEach((action) => {
    socket.on(action, (data) => require(`./${action}`)(user, data, connectedUsers));
  });


};

