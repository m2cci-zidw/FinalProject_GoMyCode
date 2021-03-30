const express=require('express')
const router=express.Router();
const {getPost,createPost,updatePost, deletePost, likePost, unlikePost, commentPost, editCommentPost, deleteCommentPost}= require('../controllers/post.controlleurs');

const multer=require('multer')
const upload=multer()





/***********POST CRUD************ */
router.get('/', getPost )
router.post('/'  ,upload.single('file'), createPost )
router.put('/:id', updatePost)
router.delete('/:id', deletePost)
router.patch('/like-post/:id', likePost)
router.patch('/unlike-post/:id', unlikePost)
router.patch('/comment-post/:id', commentPost)
router.patch('/edit-comment-post/:id',editCommentPost)
router.patch('/delete-comment-post/:id',deleteCommentPost)







module.exports = router


