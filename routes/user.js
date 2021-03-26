const express=require('express')
const router=express.Router();

const{signIn,signUp,getAllUsers, userInfo,updateUser, deleteUser, follow, unfollow}=require('../controllers/user');
const isAuth = require('../Middleware/auth');

const {registrationValidation,loginValidation,
    validation}=require('../Middleware/user')


//signUp
router.post('/signup',registrationValidation(),validation, signUp)

//signIn
router.post('/signin',loginValidation(),validation, signIn)
// is auth
router.get('/current',isAuth,(req,res)=>{
    
    res.send("authorized")
} )

// get all users
router.get('/',getAllUsers)

// get one user
router.get('/:id',userInfo)

//apdate user
router.put('/:id',updateUser);

//delete user
router.delete('/:id',deleteUser)

// follow
router.patch('/follow/:id',follow)

//unfollow
router.patch('/unfollow/:id',unfollow)




module.exports = router;