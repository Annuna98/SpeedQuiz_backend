//скрипт смены страницы для экрана десктопа и экрана игрока
//на вход принимает ключ сессии, сообщение и идентификатор вопрос
module.exports = async (user, data, connectedUsers) => {
    const { sessionId, message, question } = data;
    //console.log('sessionId: ' + sessionId + ', message: ' + message + ', question: ' + question);

    for (user of connectedUsers){
        //отправляем сообщение только пользователям, подключенным к действующей сессии
        if (user.sessionKey == sessionId){
            //если принимаем сообщение со значением true, то переходим на страницу с вопросом question
            if(message == 'true'){
                user.socket.emit('changed', JSON.stringify({
                    success: true,
                    data: question
                }));
                //если принимаем сообщение со значением false, то переходим на страницу конца игры
            } else if (message == 'false'){
                user.socket.emit('changed', JSON.stringify({
                    success: false
                }));
            }

        }

    }
};
