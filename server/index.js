const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const Post = require('./models/post.model')
const nodemailer = require('nodemailer');
const os = require('os')

const hostname = os.hostname();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

mongoose.connect('mongodb+srv://dev52:****@cluster0.msyyjkw.mongodb.net/postulate', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Add authentication middleware
const authenticateUser = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  try {
    const decoded = jwt.verify(token, 'abc123');
    const email = decoded.email;
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = user;
        next();
      })
      .catch((error) => {
        console.error('Error finding user:', error);
        res.status(500).json({ message: 'Internal server error' });
      });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

app.post('/register', async (req, res) => {
  try {
    const newPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      email: req.body.email,
      password: newPassword,
    });
    res.json({ status: 'ok' });
  } catch (err) {
    res.json({ status: 'error', error: 'Duplicate email' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log(user)
    console.log(user.email)
    console.log(email)
    console.log(password)
    if (!user) {
      return res.json({ status: 'error', error: 'Invalid login' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = jwt.sign({ email: user.email }, 'abc123');
      return res.json({ status: 'ok', user: token });
    } else {
      return res.json({ status: 'error', error: 'Invalid login' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ status: 'error', error: 'Internal server error' });
  }
});


// Endpoint to create a new post
app.post('/posts', authenticateUser, upload.single('file'), (req, res) => {
  const { title, content } = req.body;
  const file = req.file;
  const post = {
    id: uuidv4(),
    title,
    content,
    file: file ? file.filename : null,
    userId: req.user._id,
    date: req.body.date
  };

  Post.create(post)
    .then(() => {
      res.sendStatus(201);
    })
    .catch((error) => {
      console.error('Error creating post:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
});

// Endpoint to get all posts for a specific user
app.get('/posts', authenticateUser, (req, res) => {
  const userId = req.user._id;
  Post.find({ userId: userId })
    .then((posts) => {
      res.json(posts);
    })
    .catch((error) => {
      console.error('Error fetching posts:', error);
      res.status(500).json({ message: 'Internal server error' });
    });
});

app.delete('/posts/:postId', authenticateUser, (req, res) => {
  const postId = req.params.postId;

  Post.findOneAndDelete({ _id: postId })
    .then((deletedPost) => {
      if (!deletedPost) {
        return res.status(404).json({ error: 'Post not found' });
      }
      return res.status(200).json({ message: 'Post deleted successfully' });
    })
    .catch((error) => {
      console.error('Error deleting post:', error);
      return res.status(500).json({ error: 'Internal server error' });
    });
});

// Add a new endpoint to initiate the password reset process
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, 'abcd1234', {
      expiresIn: "5m",
    });
    const link = `http://${hostname}/reset-password/${oldUser._id}/${token}`;
    console.log(link);
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "dev522003@gmail.com",
        pass: "unspfufvlcpzucrh",
      },
    });

    var mailOptions = {
      from: "dev522003@gmail.com",
      to: oldUser.email,
      subject: "Password Reset",
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        return res.json({ status: "ok" });
        console.log("Email sent: " + info.response);
      }
    });
    console.log(link);
  } catch (error) { }
});

app.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  try {
    const verify = jwt.verify(token, 'abcd1234');
    res.render("reset-pass", { email: verify.email, status: "Not Verified" });
  } catch (error) {
    console.log(error);
    res.send("Not Verified");
  }
});

app.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const password = req.body.new_password;
  console.log(req.body)
  console.log(req.body.new_password)
  console.log(password)

  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  try {
    const verify = jwt.verify(token, 'abcd1234');
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );

    res.render("reset-pass", { email: verify.email, status: "verified" });
  } catch (error) {
    console.log(error);
  }
});

const Task = mongoose.model('Task', {
  task: String,
});

// Fetch all tasks
app.get('/tasks', authenticateUser, async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    console.log('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new task
app.post('/tasks', authenticateUser, async (req, res) => {
  const { task } = req.body;

  try {
    const newTask = await Task.create({ task });
    res.status(201).json(newTask);
  } catch (error) {
    console.log('Error adding task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove a task
app.delete('/tasks/:taskId', authenticateUser, async (req, res) => {
  const { taskId } = req.params;

  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.log('Error removing task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a task
app.put('/tasks/:taskId', authenticateUser, async (req, res) => {
  const { taskId } = req.params;
  const { task } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(taskId, { task }, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(updatedTask);
  } catch (error) {
    console.log('Error updating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(80, () => {
  console.log(`Server started on port 80`);
});
