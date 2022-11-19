import mongoose from 'mongoose'

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Conectado a mongo")
}).catch(error => console.log(error))