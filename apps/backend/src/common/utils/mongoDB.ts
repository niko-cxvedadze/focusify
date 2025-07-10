import mongoose from 'mongoose'

export async function connectMongoDB() {
  try {
    await mongoose.connect(
      `mongodb+srv://admin:admin@alldrive-test.tcdwuwh.mongodb.net/?retryWrites=true&w=majority&appName=alldrive-test`
    )
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('Error connecting to MongoDB: ', error)
  }
}
