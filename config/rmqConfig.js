const rmq = require('amqplib')
// const url = 'amqp://kpb:kpb123@103.230.48.151:5672//kpb?heartbeat=60';
const url = 'amqp://kpb:kpb123@localhost:15672//kpb?heartbeat=60';
module.exports = {
  connectToRmq: () => {
    return new Promise(async (resolve, reject) => {
      try {
        let rmqConn = await rmq.connect(url)
        resolve(rmqConn)
      } catch (error) {
        console.log('failed connect to rmq: ', error)
        reject(error)
      }
    })
  }
}