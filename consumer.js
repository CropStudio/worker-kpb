exports.consume = async () => {
    try {
        const con = await require('./config/rmqConfig').connectToRmq()

        const channel = await con.createChannel()
        channel.consume('kpb', async (msg) =>{
            // let message = JSON.parse(msg.content)
            // console.log(message)
            
            require('./controller/RutController').parse('message', channel)
            // channel.ack(msg)
        })

    } catch (error) {

        console.log(error)

    }
}