const express=require('express');
const router=express.Router();

const {body}= require('express-validator')
const adminController=require('../controllers/admin-controller');

const isAdminLoggedIn=require('../middlewares/isLoggedInAdmin');
router.get('/',(req,res)=>{
    res.send("Hello from admin router");
})

router.post('/register',
    body('email').isEmail().withMessage("Please enter a valid email"),
    body('password').isLength({min:6}).withMessage("Password must be atleast 6 characters long"),
    body('userName')
    .isLength({ min: 8 }).withMessage("User name must be at least 8 characters long")
    .matches(/[!@#$%^&*(),_.?":{}|<>]/).withMessage("User name must contain at least one special character"),
    adminController.registerAdmin
)
router.post('/login',
    body('email').isEmail().withMessage("Please enter email or username"),
    body('password').isLength({min:6}),
    adminController.loginAdmin
)
router.get('/get-profile',isAdminLoggedIn.isLoggedIn,(req,res)=>{
    return res.status(201).json({admin:req.admin});
})
router.get('/logout',isAdminLoggedIn.isLoggedIn, adminController.logoutAdmin);
module.exports=router;