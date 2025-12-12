const express = require("express")
const { registerController, loginController, updateUserProfileController, getAllUsersAdminController, updateAdminProfileController, googleloginController } = require("./controller/userController")
const {addBookController, getHomeBooksController, getAllBooksController, getABookController, getUserBooksController, deleteUserAddedBookController, getPurchasedBookController, getAllBooksAdminController, updateBookController, makeBookPaymentController} = require("./controller/bookController")


const jwtMiddleware = require("./middileware/jwtMiddleware")
const adminJwtMiddleware = require("./middileware/adminJwtMiddleware")
const multerConfig = require("./middileware/imgMulterMiddleware")

const router = express.Router()
//register

router.post("/register",registerController)
    
    

//login
router.post("/login",loginController)

//google login

router.post("/google-login",googleloginController)

//get home books
router.get("/home-books", getHomeBooksController)

//------------user--------------

//add book
router.post("/add-book", jwtMiddleware ,multerConfig.array("uploadImages", 3), addBookController)

//get all books
router.get("/all-books" , jwtMiddleware,getAllBooksController)

//get a book
router.get("/view-books/:id" , jwtMiddleware, getABookController)

//get user added books
router.get("/userbooks",jwtMiddleware,getUserBooksController)


//delete a user added book
router.delete("/delete-book/:id",deleteUserAddedBookController)

//get user purchased book 
router.get("/purchase-history",jwtMiddleware,getPurchasedBookController)

//profile update
router.put("/update-user-profile",jwtMiddleware, multerConfig.single("profile"), updateUserProfileController)

//get all book in admin
router.get("/get-allbooks" , getAllBooksAdminController)

//update book
router.put("/update-book/:id",updateBookController)

//get all users in admin
router.get("/get-allusers",adminJwtMiddleware,getAllUsersAdminController)

//get
router.put("/update-admin-profile",adminJwtMiddleware,multerConfig.single("profile"),updateAdminProfileController)

router.put("/make-payment",jwtMiddleware,makeBookPaymentController)



module.exports = router