//срипт проверки ответа участника
//принимает на вход имя участника, ключ сессии к которому он подключен и правильный или неправильный ответ
module.exports = async (user, data, connectedUsers) => {
    const { userName, sessionId, answer } = data;
    let validateUser = {
    }

    // for (user of connectedUsers){
    //     if (user.name == userName){
    //         if (answer){
    //             io.to(user.socket.id).emit('validated', 'Вы ответили верно!');
    //         } else if (!answer){
    //             io.to(user.socket.id).emit('validated', 'Вы ответили неверно!');
    //         }
    //
    //     }
    // }

    for (user of connectedUsers){
        if (user.name == userName){
            //если отпвет правильный, то прибавляем одно очко
            if (answer){
                user.result ++;
            }
            validateUser = {
                name: userName,
                result: user.result
            };


            // validatedUsers.push(validateUser);
        }

    }

    //отправляем сообщение только пользователям, подключенным к действующей сессии
    //отправляю новый объект validateUser, т.к. если отправлять массив connectedUsers,
    // который содержит объект socket, происходит ошибка
    for (user of connectedUsers){
        if (user.sessionKey == sessionId){
            user.socket.emit('validated', JSON.stringify({
                success: true,
                data: validateUser
            }));
        }

    }
};
