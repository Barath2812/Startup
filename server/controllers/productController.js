const { cloudinary } = require("../configs/cloudinary");
const Product = require("../models/Product");



// Add Product :/api/product/add
const addProduct = async (req, res) => {
    try{
        let productData = JSON.parse(req.body.productData);

        const images = req.files;
        
        let imageUrl = await Promise.all(
            images.map(async (image) => {
                const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { resource_type: "image" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    uploadStream.end(image.buffer);
                });
                return result.secure_url;
    }));

    await Product.create({ ...productData, image: imageUrl });
    
    res.status(200).json({ message: "Product added successfully" });

    }catch(error){
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};

// Get Product :/api/product/list
const ProductList = async (req, res) => {
    try{
        const products = await Product.find({});
        res.status(200).json({ success: true, products });

    }catch(error){
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });

    }

};

// Get single Product :/api/product/id
const ProductById = async (req, res) => {
    try{
        const {id} = req.body;
        const product = await Product.findById(id);
        res.status(200).json(product);

    }catch(error){
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }

};

//change product instock : /api/product/stock
const changeStock = async (req, res) => {
    try {
        const { id, inStock } = req.body;
        const product = await Product.findByIdAndUpdate(id, { inStock }, { new: true });
        res.status(200).json({ success: true, product });
    }catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}


module.exports = { addProduct , ProductList , ProductById , changeStock };