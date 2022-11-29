const mongoose = require('mongoose');

const dbConection = async() => {
    try {
        await mongoose.connect(process.env.DB_CNN);
        console.log('lo logre :D')
        
    } catch (error) {
        console.log(error);
        throw new Error('fallo')
    }
}

module.exports = {
    dbConection
}