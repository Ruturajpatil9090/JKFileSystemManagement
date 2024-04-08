const express = require('express');
const ADODB = require('node-adodb');

const connectionString = 'Provider=Microsoft.Jet.OLEDB.4.0;Data Source=D:\\data\\eTimeTrackLite1.mdb';
const connection = ADODB.open(connectionString);

const router = express.Router();

router.get('/getTableData/:year/:month', async (req, res) => {
  try {
    const year = req.params.year;
    const month = req.params.month;
    const UserId = req.query.UserId;

    const tableName = `DeviceLogs_${month}_${year}`;
    const whereCondition = `UserId = '${UserId}'`;

    const data = await connection.query(`SELECT UserId, LogDate FROM ${tableName} WHERE ${whereCondition} ORDER BY userid, logdate`);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/getTableDatas', async (req, res) => {
  try {
    // const UserId = req.query.UserId;
    // const whereCondition = `UserId = '${UserId}'`;

    const tableName = 'DeviceLogs_9_2023'; // You may want to change this based on your logic

    const data = await connection.query(`SELECT UserId, LogDate FROM ${tableName} ORDER BY userid, logdate`);
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
