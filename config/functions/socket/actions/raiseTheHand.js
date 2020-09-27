
//скрипт, отслеживающий участников, нажавших кнопку знаю ответ
//принимает на вход имя участника и номер сессии
module.exports = async (user, data, connectedUsers) => {
    const { userName, sessionId } = data;


        for (user of connectedUsers){
            //отправляем сообщение только пользователям, подключенным к действующей сессии
            if (user.sessionKey == sessionId){
                    user.socket.emit('raised', JSON.stringify({
                        success: true,
                        data: userName
                    }));

            }

        }







};
