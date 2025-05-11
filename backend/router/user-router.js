const express=require('express');
const router=express.Router();
const {body}= require('express-validator')
const userController=require('../controllers/user-controller');
const isLoggedIn=require('../middlewares/isLoggedInUser').isLoggedIn;
const upload=require('../config/multer-config')
router.get('/',(req,res)=>{
    res.send("Hello from user router");
})

router.post('/register',
    body('email').isEmail().withMessage("Please enter a valid email"),
    body('password').isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body('userName')
        .isLength({ min: 8 }).withMessage("User name must be at least 8 characters long")
        .matches(/[!@#$%^&*(),_.?":{}|<>]/).withMessage("User name must contain at least one special character"),
    userController.registerUser
);

router.post('/login',
    body('identifier')
        .notEmpty().withMessage("Please enter email or username"),
    body('password')
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    userController.loginUser
);
router.get('/get-profile',isLoggedIn,(req,res)=>{
    return res.status(201).json({user:req.user});
})
router.post('/update-profile',isLoggedIn,upload.single("picture"), userController.updateProfile)
router.get('/add-to-cart/:id',isLoggedIn,userController.addToCart);
router.get('/remove-from-cart/:id',isLoggedIn,userController.removeFromCart);
router.get('/logout',isLoggedIn, userController.logoutUser);
module.exports=router;