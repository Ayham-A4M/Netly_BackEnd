require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const { default: mongoose } = require('mongoose');
const errorHandling = require('./src/middleware/errorHandling')
const path=require('path')
// Routes
const authRoutes=require('./src/routes/auth');
const postRoutes=require('./src/routes/posts');
const profileRoutes=require('./src/routes/profile');
const commentRoutes=require('./src/routes/comments');
const notificationRoutes=require('./src/routes/notifications');
const eventRoutes=require('./src/routes/event');
const activityRoutes=require('./src/routes/activity');
// Routes
const PORT = 8000;
const cors=require('cors')
mongoose.connect(process.env.DATA_BASE_URI).then(() => {
    console.log("connected complete !!")
}).catch(err => {
    console.log(err);
})

app.use(cors({
  origin: ['http://localhost:5173','http://localhost:5173'], // No trailing slash, no array for single origin
  credentials: true // This is crucial
}));
// require('./src/public')
app.use('/public', express.static(path.join(__dirname, '/src/public'))); // serve the images from public folder
app.use(cookieParser());
app.use(express.json());
app.use(authRoutes);
app.use(postRoutes);
app.use(profileRoutes);
app.use(commentRoutes);
app.use(notificationRoutes);
app.use(eventRoutes);
app.use(activityRoutes);
app.get('/test',(req,res)=>{
    console.log('test');
    return res.status(200).send('done');
})
app.use(errorHandling);

app.listen(PORT, () => {
    console.log(`app listen now on port ${PORT}`);
})
