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
const emailRouter = require("./EmailRouter.js");

const Port = process.env.PORT || 5000;



app.use(express.json());
app.use(cors());
app.use(express.static(__dirname));

/* main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(process.env.URL);
  console.log('db connected')
} */



// let refreshTokens = [];

// app.post("/api/login", (req, res) => {
//   console.log("req is:", req.body)
//   let responseData = "not found";
//   const bodyDetails = req.body;

//   Profile.findOne({ username: bodyDetails}, function (err, docs) {
//     if (err){
//         console.log(err)
//     }
//     else{
//         console.log("Result : ", docs);
//     }
// });
//   const foundUser = users.find(element => element.username === bodyDetails.username);
//   if (foundUser === undefined) {
//     responseData = "Username do not match"
//   }
//   else {
//     if (foundUser.password === bodyDetails.password) {
//       responseData = foundUser
//     }
//     else {
//       responseData = "password do not match"
//     }
//   }
//   res.status(200).json(
//     responseData
//   );
//   console.log("user:", foundUser);

//   //if everything is ok, create new access token, refresh token and send to user
// });


// app.post("/api/login", (req, res) => {
//   console.log("req is:", req.body)
//   let responseData = "not found";
//   const bodyDetails = req.body;

//   const foundUser = Profile.findOne({ username: bodyDetails.username }, function (err, foundUser) {
//     if (err) {
//       console.log(err)
//       res.status(500).json({ error: err });
//     }
//     else if (!foundUser) {
//       console.log("User not found");
//       res.status(404).json({ message: "User not found" });
//     }
//     else {
//       console.log("Result : ", foundUser);
//       if (foundUser.password === bodyDetails.password) {
//         responseData = foundUser
//         res.status(200).json(responseData);
//       }
//       else {
//         responseData = "password do not match"
//         res.status(401).json({ message: responseData });
//       }
//     }
//   });
// });

// const generateAccessToken = (user) => {
//   return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, "mySecretKey", {
//     expiresIn: "1m",
//   });
// };

// const generateRefreshToken = (user) => {
//   return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, "myRefreshSecretKey");
// };

// app.post("/api/login", (req, res) => {
//   const { username, password } = req.body;
//   const user = users.find((u) => {
//     return u.username === username && u.password === password;
//   });
//   if (user) {
//     //Generate an access token
//     const accessToken = generateAccessToken(user);
//     const refreshToken = generateRefreshToken(user);
//     refreshTokens.push(refreshToken);
//     res.json({
//       username: user.username,
//       isAdmin: user.isAdmin,
//       accessToken,
//       refreshToken,
//     });
//   } else {
//     res.status(400).json("Username or password incorrect!");
//   }
// });

// const verify = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (authHeader) {
//     const token = authHeader.split(" ")[1];

//     jwt.verify(token, "mySecretKey", (err, user) => {
//       if (err) {
//         return res.status(403).json("Token is not valid!");
//       }

//       req.user = user;
//       next();
//     });
//   } else {
//     res.status(401).json("You are not authenticated!");
//   }
// };

// app.delete("/api/users/:userId", verify, (req, res) => {
//   if (req.user.id === req.params.userId || req.user.isAdmin) {
//     res.status(200).json("User has been deleted.");
//   } else {
//     res.status(403).json("You are not allowed to delete this user!");
//   }
// });

// app.post("/api/logout", verify, (req, res) => {
//   const refreshToken = req.body.token;
//   refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
//   res.status(200).json("You logged out successfully.");
// });

app.use(taskRouter);
app.use(profileRouter);
app.use(projectRouter);
app.use(emailRouter);


app.listen(Port, () => {
  console.log('server started', Port)
});
