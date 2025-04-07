import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from "../models/user.js"
import dotenv from "dotenv";

dotenv.config();    
const SECRET_KEY = process.env.SECRET_KEY;


export const registerUser = async (req, res) => {
    try {
    const { username, email, password, role } = req.body; 


    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Phải điền tất cả thông tin' });
    }

    if (typeof username !== 'string' || username.trim() === '') {
        return res.status(400).json({ message: 'Tên không hợp lệ' });
    }
    if (typeof email !== 'string' || email.trim() === '' || !email.includes('@')) {
        return res.status(400).json({ message: 'Email không hợp lệ' });
    }

    const user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ message: 'Email đã có người dùng' });
    }

    const usernameexist = await User.findOne({ username });
    if (usernameexist) {
        return res.status(400).json({ message: 'Username đã có người dùng' });
    }

    if (typeof password !== 'string' || password.trim() === '') {
        return res.status(400).json({ message: 'Mật khẩu không hợp lệ' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role: role || "user"
    });

    await newUser.save();
    res.status(201).json({ message: 'Đăng kí user thành công' });

    } catch (error) {
    res.status(400).json({ message: error.message });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
         if (!email || !password) {
        return res.status(400).json({ message: 'Phải điền tất cả thông tin' });
        }
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Thông tin sai' });
        
        const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ token, role: user.role });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        }
        
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy user" });
        }

        if (user.role !== 'admin' && req.user.id !== req.params.id) {
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        }

        const originalUser = await User.findById(req.params.id);
        if (!originalUser) {
            return res.status(404).json({ message: "Không tìm thấy user" });
        }

        const updatedData = req.body;

        if (updatedData.email && updatedData.email !== originalUser.email) {
            const emailExists = await User.findOne({ email: updatedData.email });
            if (emailExists) {
                return res.status(400).json({ message: "Email đã có người dùng" });
            }
        }

        if (updatedData.username && updatedData.username !== originalUser.username) {
            const usernameExists = await User.findOne({ username: updatedData.username });
            if (usernameExists) {
                return res.status(400).json({ message: "Username đã có người dùng" });
            }
        }

        const changes = {};
        for (const key in updatedData) {
            if (updatedData[key] !== originalUser[key]) {
                changes[key] = { old: originalUser[key], new: updatedData[key] };
            }
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!updatedUser) return res.status(404).json({ message: 'Không tìm thấy user' });

        if (Object.keys(changes).length > 0) {
            console.log("Updated fields:", changes);
        }

        res.json({
            updatedUser,
            changes: changes, 
        });
    } catch (error) {
        if (error.response) {
            // Log the full response if error is from the backend
            console.error("Error response data:", error.response.data);
            console.error("Error response status:", error.response.status);
        } else {
            console.error("Error:", error.message);
        }
    }

};




export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user)
        {
            return res.status(404).json({message: "Không tìm thấy user"});
        }
        if (user.role !== 'admin' && req.user.id !== req.params.id) {
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        }
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: 'Không tìm thấy user' });
        res.json({ message: 'User đã được xóa' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        }
 
        const user = await User.findById(req.params.id); 

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const changeUserPassword = async (req, res) => {
    try {
         if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
            return res.status(403).json({ message: 'Không có quyền truy cập' });
        }

        const user = await User.findById(req.user.id); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Phải điền tất cả thông tin' });
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Không đúng mật khẩu cũ' });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();
        res.json({ message: 'Đổi mật khẩu thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); 
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
