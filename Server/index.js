// index.js (the main application)

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const cors = require('cors');
const employeeRoutes = require('./routes/employeeRoutes');
const dataRoutes = require('./AccessMDBFile');
const sql = require('mssql');

const { exec } = require('child_process');

const app = express();
app.use(cors());
const port = process.env.PORT || 5000;

app.use(bodyParser.json({ limit: '50mb' }));
app.use('/api/employees', employeeRoutes);
app.use('/api/data', dataRoutes); 


app.post('/api/backup', async (req, res) => {
  try {
    const backupFileName = `E:\\Ruturaj Development\\Database Backup\\Backup\\fileSystem-${Date.now()}.bak`;

    // Configure database connection
    const dbPort = parseInt(process.env.DB_PORT, 10);

    // Configure database connection
    const pool = new sql.ConnectionPool({
      server: process.env.DB_HOST,
      port: dbPort,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      options: {
        encrypt: true,
        enableArithAbort: true,
        connectionTimeout: 30000,
      },
    });

    // Execute the backup command
    const result = await exec(`sqlcmd -S ${process.env.DB_HOST} -d ${process.env.DB_NAME} -U ${process.env.DB_USER} -P ${process.env.DB_PASSWORD} -Q "BACKUP DATABASE [${process.env.DB_NAME}] TO DISK = '${backupFileName}'"`);

    console.log('Backup successful:', result.stdout);

    // Save the backup information to your database (if needed)

    res.status(200).json({ success: true, message: 'Database backup successful', backupFileName });
  } catch (error) {
    console.error('Error during backup:', error.message);
    res.status(500).json({ success: false, message: 'Database backup failed' });
  }
});

// Sync Sequelize models with the database
sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
