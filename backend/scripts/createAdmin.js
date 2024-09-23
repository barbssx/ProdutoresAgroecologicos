const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Producer = require('../models/Producer'); 

dotenv.config();
const connectDB = require('../config/db'); 

connectDB();

const createAdmin = async () => {
  try {
    const adminExists = await Producer.findOne({ email: 'admin@example.com' });
    if (!adminExists) {
      const admin = new Producer({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'adminpassword', 
        isAdmin: true, 
      });
      await admin.save();
      console.log('Administrador criado com sucesso.');
    } else {
      console.log('Administrador já existe.');
    }
    process.exit();
  } catch (error) {
    console.error('Erro ao criar administrador:', error.message);
    process.exit(1);
  }
};

createAdmin();
