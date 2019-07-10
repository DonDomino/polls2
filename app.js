const express = require("express");
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const uri = 'mongodb+srv://default:1234@cluster0-hh2r8.mongodb.net/polls2019?retryWrites=true&w=majority';

mongoose.connect(uri, { useNewUrlParser: true });
app.use(express.urlencoded());
app.set('view engine', 'pug');
app.set('views', 'views');
app.use('/static', express.static(path.join(__dirname, 'static')));

const userSchema = mongoose.Schema({
  name: String,
  email: String
});

const pollSchema = mongoose.Schema({
  title: String,
  description: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Poll = mongoose.model("Poll", pollSchema);
const User = mongoose.model("User", userSchema);

app.get("/", async (req, res) => {
  const polls = await Poll.find().populate('author');
  res.render("index", {polls});
});
app.get("/polls/new", (req, res) => {
  res.render("new");
});
app.post("/polls", async (req, res, next) => {
  let pollTitle = req.body.pollTitle;
  let pollDesc = req.body.pollDesc;
  try {
    await Poll.create({ title: pollTitle, description: pollDesc, author: "5d24c7701c9d440000d69990" });    
    res.redirect("/");
  } catch (e) {
    next(e);
  }  
});
app.get("/polls/:id", async (req, res, next) => {
  try {
    await Poll.findById(req.params.id, (err, poll) => {      
    poll.remove();
    });
    res.redirect("/");
  } catch (e) {
    next(e)
  } 
});

app.listen(3000, () => console.log('Listening on port 3000!'));