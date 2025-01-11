import express from 'express';
import 'dotenv/config';
import User from './models/user.js';
import Paper from './models/paper.js';
import Admin from './models/admin.js';
import mongoose from 'mongoose';
import multer from 'multer';
import { exec } from 'child_process';
import path from 'path';
import cors from 'cors';
const app = express();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3001',  // Allow frontend at localhost:3001
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
});

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const originalExtension = path.extname(file.originalname); // Get original file extension
        const uniqueFilename = `${file.fieldname}-${Date.now()}${originalExtension}`; // Create a unique filename with the original extension
        cb(null, uniqueFilename);
    }
});

// Set up multer for file handling
const upload = multer({ storage });

// Creating a new user or admin
app.post('/user', async (req, res) => {
    try {
        const { email, name, role, PSR, officePhone, PhoneNum, chamberNum, Dept } = req.body;

        // Validate role
        if (!['User', 'Admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role. Must be "User" or "Admin".' });
        }

        // Create user/admin based on role
        const user = await User.create({ email, name, role, PSR, officePhone, PhoneNum, chamberNum, Dept });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Getting user/admin details by email
app.get('/user/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User/Admin not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Getting user/admin details by ID
app.get('/user/byid/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User/Admin not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Getting only the ID of a user/admin by email
app.get('/user_id/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User/Admin not found' });
        }
        return res.status(200).json(user._id);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

// Deleting a user/admin by ID
app.delete('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User/Admin not found' });
        }
        res.status(200).json({ message: 'User/Admin deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// List of all users
app.get('/allUsers', async (req, res) => {
    try {
        const users = await User.find({ role: 'User' });
        //console.log(users);
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: 'No users found' });
    }
});

// List of all admins
app.get('/allAdmins', async (req, res) => {
    try {
        const admins = await User.find({ role: 'Admin' });
        res.status(200).json(admins);
    } catch (error) {
        res.status(404).json({ message: 'No admins found' });
    }
});

app.get('/allpeople',async (req, res) => {
    try {
        const people = await User.find();
        console.log(people);
        res.status(200).json(people);
    } catch (error) {
        res.status(404).json({ message: 'No people found' });
    }
});

//Create Paper details by User_id
app.post('/:id/paper', async(req, res) => {
    try{
        const { id } = req.params;
        const {title, author, DOI, publisher, year, journal, volume, pages} = req.body;
        const dup_paper = await Paper.findOne({ DOI });
        if(dup_paper){
            return res.status(400).json({message: "Citation Already Published By You or someone else"})
        }
        const user = await User.findById(id);
        if(!user){
            return res.status(400).json({message: "There was a problem creating paper"});
        }
        const creator = id;
        const paper = await Paper.create({title, author, DOI, publisher, year, journal, volume, pages, creator});
        user.DOI.push(DOI);
        await user.save();
        res.status(200).json(paper);
    }
    catch(error){
        console.log(error.message);
        res.status(500).json({message: error.message});
    }
});

app.get('/user/:id/papers', async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);  
      const DOIs = user.DOI;
      const papers = [];
  
      for (const DOI of DOIs) {
        const paper = await Paper.findOne({ DOI });
        if (paper) {
          papers.push(paper);
        }
      }
      res.json(papers);
    } catch (error) {
      console.error('Error fetching papers:', error);
      res.status(500).json({ message: 'Error fetching papers' });
    }
  });

  app.put('/user/update/:id', async (req, res) => {
    try {
      const { id } = req.params; // Get the user ID from the URL parameter
      const updateData = req.body; // Get the new data to update from the request body
  
      // Find the user by ID and update the provided fields
      const updatedUser = await User.findByIdAndUpdate(id, updateData, { 
        new: true, // Return the updated document
        runValidators: true // Ensure validation rules are applied
      });
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({
        message: 'User updated successfully',
        user: updatedUser
      });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Failed to update user', error: error.message });
    }
  });
  

    app.get('/user/:id/tagged/papers', async (req, res) => {
        try {
        const { id } = req.params;
        const user = await User.findById(id);  
        const DOIs = user.tagged_DOI;
        const papers = [];
    
        for (const DOI of DOIs) {
            const paper = await Paper.findOne({ DOI });
            if (paper) {
            papers.push(paper);
            }
        }
        res.json(papers);
        } catch (error) {
        console.error('Error fetching papers:', error);
        res.status(500).json({ message: 'Error fetching papers' });
        }
    });

//Finding paper details by id
app.get('/paper/:id', async(req, res) => {
    try{
        const { id } = req.params;
        const paper = await Paper.findById(id);
        if(!paper){
            res.status(404).json({message: 'paper not found'})
        }
        res.status(200).json(paper);
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
});

//Delete paper by id
app.delete('/paper/:id', async (req, res) => {
    try {
        const id = req.params.id;
        // Find and delete the paper
        const paper = await Paper.findById(id);
        const DOI = paper.DOI;
        console.log(paper);
        if (!paper) {
            return res.status(404).json({ message: 'Paper not found' });
        }

        // Find users with DOI in their DOI array
        const usersWithDOI = await User.findById(paper.creator);
        usersWithDOI.DOI = usersWithDOI.DOI.filter(item => item !== DOI);
        await usersWithDOI.save();

        // Find users with DOI in their tagged_DOI array
        const usersWithTaggedDOI = await User.find({ tagged_DOI: paper.DOI });
        console.log(usersWithTaggedDOI);
        if(usersWithTaggedDOI){
            for (const user of usersWithTaggedDOI) {
                user.tagged_DOI = user.tagged_DOI.filter(item => item !== DOI);
                await user.save();
            }
        }
        await Paper.findByIdAndDelete(paper._id);
        res.status(200).json({ message: 'Paper and associated DOI entries deleted successfully' });
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});


//List of all papers
app.get('/allpapers', async (req, res) => {
    try{
        const paper = await Paper.find({});
        res.status(200).json(paper);
    }
    catch(error){
        res.status(404).json({message: 'NO PAPERS FOUND'});      
    }
});

//Tagging paper and users
app.post('/paper/tag/:encodedDOI/:email', async(req, res) => {
    try{
        const {encodedDOI, email} = req.params;
        const DOI = decodeURIComponent(encodedDOI);
        const user = await User.findOne({email});
        const paper = await Paper.findOne({DOI});
        paper.taggers.push(user._id);
        user.tagged_DOI.push(DOI);
        await user.save();
        await paper.save();
        res.status(200).json({DOI, email});
    }
    catch(error){
        res.status(404).json({ message : error.message})
    }
})

//Uploading file
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    // Run Python script and pass the file path
    exec(`python process_citation.py ${filePath}`, (error, stdout, stderr) => {
        if (error) {
            console.error("Error executing Python script:", error);
            return res.status(500).json({ error: 'Failed to process file' });
        }
        if (stderr) {
            console.error("Python script error output:", stderr);
            return res.status(500).json({ error: 'Python script error' });
        }

        // Parse and send back the result from Python script
        const result = JSON.parse(stdout);
        res.json(result);
    });
});

//login checking
// Login checking for user or admin
app.get('/login/:role/:email', async (req, res) => {
    try {
        const { role, email } = req.params; // Retrieve role and email from URL

        // Validate role
        if (!['User', 'Admin'].includes(role)) {
            return res.status(400).json({ authorize: 'NO', message: 'Invalid role' });
        }

        // Find user/admin by email and role
        const user = await User.findOne({ email, role });

        if (!user) {
            return res.status(404).json({ authorize: 'NO' }); // User/Admin not found
        }

        // User/Admin found, return authorized response
        res.status(200).json({ authorize: 'YES' });
    } catch (error) {
        console.error("Error checking login:", error);
        res.status(500).json({ authorize: 'NO' });
    }
});



app.get('/:userid/:paperid/tagged/accepted', async(req, res) => {
    try{
        const {userid, paperid} = req.params;
        const user = await User.findById(userid);
        const paper = await Paper.findById(paperid);
        const DOI = paper.DOI;
        user.tagged_DOI = user.tagged_DOI.filter(item => item !== DOI);
        user.DOI.push(DOI);
        await user.save();   
        res.status(200).json({ accepted: 'OK'});
    }
    catch(error){
        console.error(error);
        res.status(500).json({ accepted: 'NO' });
    }
})

app.get('/:userid/:paperid/tagged/declined', async(req, res) => {
    try{
        const {userid, paperid} = req.params;
        const user = await User.findById(userid);
        const paper = await Paper.findById(paperid);
        const DOI = paper.DOI;
        user.tagged_DOI = user.tagged_DOI.filter(item => item !== DOI);
        await user.save();   
        res.status(200).json({ accepted: 'NO'});
    }
    catch(error){
        console.error(error);
        res.status(500).json({ accepted: 'Error' });
    }
})

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected.");
        app.listen(process.env.PORT, () => {
            console.log('Testing...');
        });
    })
    .catch(() => {
        console.log("Connection failed");
    });
