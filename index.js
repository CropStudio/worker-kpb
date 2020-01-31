var express = require('express')
var app = express()
var mongoose = require('mongoose')
var port = process.env.PORT || 5030
var path = require('path')

async function main() {
    try {

        // let conn = await require('./rmq/config').connectToRmq()

        require('./consumer').consume()

    } catch (error) {

        console.log(error)

    }
}


app.use("/static",express(path.join(__dirname,"static")));
app.use(express.static('static'));

const mongoURL = 'mongodb://petani:Kpb1245@103.230.48.151:27017/kpb';

mongoose.connect(mongoURL,{
    useCreateIndex: true,
    useNewUrlParser:true,
    useUnifiedTopology: true
}).then(() => console.log('connect mongodb'))
.catch(err => console.log(err));
main()
app.listen(port, function(){
    console.log("Worker Started on port "+ port)
})