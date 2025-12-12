const books = require("../model/bookModel");
const stripe = require('stripe')(process.env.STRIPESECRETKEY);
exports.addBookController = async (req, res) => {
    console.log("inside add book controller");

    const { title, author, noOfPages, imageUrl, price, dPrice, abstract, publisher, language, isbn, category } = req.body


    // console.log(req.files); 
    // const uploadImages = req.files
    // console.log(uploadImages);

    var uploadImages = []
    req.files.map((item) => uploadImages.push(item.filename))

    // console.log(uploadImages);
    const userMail = req.payload
    console.log(title, author, noOfPages, imageUrl, price, dPrice, abstract, publisher, language, isbn, category, uploadImages, userMail);


    // console.log(userMail);

    try {
        const existingBook = await books.findOne({ title, userMail })
        console.log(existingBook);


        if (existingBook) {
            res.status(401).json(`you  already added the book `)
        }
        else {
            console.log(`inside eeeeeee`);

            const newBook = new books({
                title, author, noOfPages, imageUrl, price, dPrice, abstract, publisher, language, isbn, category, uploadImages, userMail
            })
            await newBook.save()
            res.status(200).json(newBook)
        }
    } catch (error) {
        res.status(500).json(error)

    }


}


//get home books
exports.getHomeBooksController = async (req, res) => {
    console.log("inside Home book controller");
    try {
        const homeBooks = await books.find().sort({ _id: -1 }).limit(4)
        res.status(200).json(homeBooks)
    } catch (error) {
        res.status(500).json(error)
    }

}

//get all books-user side

exports.getAllBooksController = async (req, res) => {
    console.log("inside All book controller");
    //here we get search in res-query
    const searchKey = req.query.search


    const userMail = req.payload
    //$options used to avoid case sensitive
    const query = {
        title: { $regex: searchKey, $options: "i" },
        userMail: { $ne: userMail }
    }

    try {
        const allBooks = await books.find(query)
        res.status(200).json(allBooks)
    } catch (error) {
        res.status(500).json(error)
    }

}


//get a book controller
exports.getABookController = async (req, res) => {
    console.log(`Get a Book controller`);

    const { id } = req.params; //path req.params il undavm
    console.log(id);
    try {
        const book = await books.findById({ _id: id })
        res.status(200).json(book)
    } catch (error) {
        res.status(500).json(error)
    }
}

//user added book display controller get user books
exports.getUserBooksController = async (req, res) => {
    console.log(`Inside Get user added books controller`);
    const userMail = req.payload
    try {
        const userBooks = await books.find({ userMail })
        res.status(200).json(userBooks)
    } catch (error) {
        res.status(500).json(error)
    }
}
//delete user added books
exports.deleteUserAddedBookController = async (req, res) => {
    console.log(`Inside Delete a book controller`);
    const { id } = req.params;
    try {
        await books.findByIdAndDelete({ _id: id })
        res.status(200).json(`Book Deleted Successfully`)
    } catch (error) {
        res.status(500).json(error)
    }

}

//user purchasedbook controller
exports.getPurchasedBookController = async (req, res) => {
    console.log(`Inside purchase history controller`);
    const userMail = req.payload //email from jwt
    try {
        //finding book purchased the logged-in user
        const purchasedBooks = await books.find({ boughtBy: userMail })
        res.status(200).json(purchasedBooks)
    } catch (error) {
        res.status(500).json(error)
    }
}


//---------------admin----------
//get all books
exports.getAllBooksAdminController = async (req, res) => {
    console.log(`Inside get all book for admin controller`);
    try {
        const allAdminBooks = await books.find()
        res.status(200).json(allAdminBooks)
    } catch (error) {

    } res.status(500).json(error)

}

//update book status as approved

exports.updateBookController = async (req, res) => {
    console.log(`Inside update book controller`);
    const { id } = req.params

    const updateBookData = {
        status: "approved"
    }
    try {
        const updateBook = await books.findByIdAndUpdate({ _id: id }, updateBookData, { new: true })
        res.status(200).json(updateBook)
    } catch (error) {
        res.status(500).json(error)
    }

}
//make payment
exports.makeBookPaymentController = async (req, res) => {
    console.log(`inside make book payment controller`);
    const { _id, title, author, noOfPages, imageUrl, price, dPrice, abstract, publisher, language, isbn, category, uploadImages, userMail } = req.body
    const email = req.payload
    try {
        const updateBookPayment = await books.findByIdAndUpdate({ _id }, { title, author, noOfPages, imageUrl, price, dPrice, abstract, publisher, language, isbn, category, uploadImages, status: "sold", boughtBy: email, userMail }, { new: true })
        console.log(updateBookPayment);

        const line_items = [{
            price_data: {
                currency: "usd",
                product_data: {
                    name: title,
                    description: `${author}|${publisher}`,
                    // images: [imageUrl],
                    metadata: {
                        title, author, noOfPages, imageUrl, price, dPrice, abstract, publisher, language, isbn, category, status: "sold", boughtBy: email, userMail
                    }
                },
                unit_amount: Math.round(dPrice * 100)
            },
            quantity: 1
        }]

        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            success_url: 'http://localhost:5173/payment-success',
            cancel_url: 'http://localhost:5173/payment-error',
            line_items,
            payment_method_types:['card']
        });
        console.log(session);
        res.status(200).json({ checkoutSessionUrl: session.url })
        // res.status(200).json(`success response received`)

    } catch (error) {
        res.status(500).json(error)
    }
}






