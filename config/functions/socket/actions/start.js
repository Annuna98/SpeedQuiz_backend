//скрипт начала раунда
//принимает на вход номер вопроса и ключ сессии
module.exports = async (user, data, connectedUsers) => {
    const { questionId, session } = data;

    const question = await strapi
        .query('question')
        .findOne({
            id: questionId
        });

    //console.log('User finded question: ', JSON.stringify(question));

    if (!question){
        user.socket.emit('started', JSON.stringify({
            success: false,
            error: 'NO SUCH QUESTION ID'
        }));
    }

    for (const user of connectedUsers){
        //отправляем сообщение только пользователям, подключенным к действующей сессии
        if (user.sessionKey == session){
            user.socket.emit('started', JSON.stringify({
                success: true,
                data: questionId
            }));
        }



    }


};
