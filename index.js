const express = require('express')
const cors = require('cors')
const sequelize = require('./lib/sequelize')
const userModel = require('./models/user')
const app = express()

const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// sync database with server
sequelize.sync().then(()=>{
    console.log('Database connected successfully.')
}).catch((err)=>{
    console.error('Error connecting to the database:', err)
})


app.get('/users', async (req, res) => {
    try{
        const users = await userModel.findAll();
        if(users.length === 0){
            return res.status(404).json({ message: 'No users found' })
        }
        res.status(200).json(users)
    }catch(err){
        res.status(500).json({ message: 'Error retrieving users', error: err.message })
    }
})

app.get('/users/:id', async (req, res) => {
    let userId = parseInt(req.params.id)
    try{
        let user = await userModel.findByPk(userId)
        if(!user){
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json(user)
    }catch(err){
        res.status(500).json({ message: 'Error retrieving user', error: err.message })
    }
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})