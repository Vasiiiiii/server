import express from "express";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";


const port = 5500;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(`mongodb+srv://Vasika:vasika2005@cluster0.6k1a2ao.mongodb.net/workshop`);
const db = mongoose.connection;

db.once('open', () => {
    console.log("Mongodb connection successful");
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true }, // Changed from name to username
    phonenumber: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const UserModel = mongoose.model("users", userSchema);

app.post('/register', async (req, res) => {
    const { username, phonenumber, email, password } = req.body;
    
    try {
         // Hash password
        const user = new UserModel({ username, phonenumber, email, password });
        await user.save();
        res.json({ success: true });
    } catch (error) {
        console.log('Error during registration:', error);
        res.json({ success: false });
    }
});

/*app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await UserModel.findOne({ email });
        
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        
        const passwordMatch = (password==user.password) // Compare hashed password
        
        if (passwordMatch) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }*/
        app.post('/login', async (req, res) => {
            const { email, password } = req.body;
        
            try {
                const user = await UserModel.findOne({ email });
        
                if (!user) {
                    console.log('User not found:', email);
                    return res.json({ success: false, message: 'User not found' });
                }
        
                const passwordMatch = (password==user.password);
        
                if (passwordMatch) {
                    console.log('Login successful for user:', email);
                    res.json({ success: true });
                } else {
                    console.log('Invalid password for user:', email);
                    res.json({ success: false, message: 'Invalid credentials' });
                }
            } catch (error) {
                console.error('Error during login:', error);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
            }
        });
        


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
