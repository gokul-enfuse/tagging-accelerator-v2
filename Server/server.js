require('dotenv').config();
const express = require("express");
// const userRouter = express.Router();
const cors = require('cors')
const jwt = require("jsonwebtoken");
const app = express();
const bodyParser = require('body-parser');
const taskRouter = require("./TaskRouter.js");
const profileRouter = require("./ProfileRouter.js");
const projectRouter = require("./ProjectRouter.js");
const PortConnection = require("./PortConnection.js");

const emailRouter = require("./EmailRouter.js");
const bulkuploadRouter = require("./BulkuploadRouter.js");
const historicalRec = require("./HistoricalrecRouter.js");
const commonBulkUploadRouter = require("./CommonBulkUploadRouter.js");
const reportRouter = require('./ReportRouter.js');

const Port = process.env.PORT || 3030;
app.use(express.json());
//app.use(cors());
//code by mayur.patil on 10Sept2024 - Start
const domainsFromEnv = "http://44.207.171.24:3000, http://localhost:3000, http://localhost:3001, http://44.207.171.24:5001, http://44.207.171.24:5000 ";
const whitelist = domainsFromEnv.split(",").map(item => item.trim())
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}
app.use(cors(corsOptions))
//code by mayur.patil on 10Sept2024 - End


app.use(express.static(__dirname));
app.use("/assets", express.static('uploads'));

app.post('/api/getCurrentURL', (req, res) => {
  res.json({ message: 'Home URL received and processed on the server' })

})
app.use(taskRouter);
app.use(profileRouter);
app.use(projectRouter);
app.use(emailRouter);
app.use(bulkuploadRouter);
app.use(historicalRec);
app.use(commonBulkUploadRouter);
app.use(reportRouter);

app.listen(Port, () => {
  console.log('server started', Port)
});
