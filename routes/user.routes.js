const express=require('express')
const router=express.Router();

const{signIn,signUp}=require('../controllers/auth.controlleurs');
// (signUp & signIN FN) =>auth.controlleurs
const {getAllUsers, userInfo,updateUser, deleteUser, follow, unfollow} =require('../controllers/user.controlleurs');
//test token (expiration & if he have a valid key)
const isAuth = require('../Middleware/auth');
//auth validation compte (file user-middlware)
const {registrationValidation,loginValidation, validation}=require('../Middleware/user')


//signUp
router.post('/signup',registrationValidation(),validation, signUp)
//signIn
router.post('/signin',loginValidation(),validation, signIn)
// is auth (route privée)
router.get('/current',isAuth,(req,res)=>{  
    res.send("authorized")
})

/***********get all users 'CRUD'************ */
router.get('/',getAllUsers)
// get one user
router.get('/:id',userInfo)
//update user
router.put('/:id',updateUser);
//delete user
router.delete('/:id',deleteUser)
/************************************ */

// follow
router.patch('/follow/:id',follow)
//unfollow
router.patch('/unfollow/:id',unfollow)





module.exports = router