import  Product  from "../../models/products.js"


export const getProductsByCategoryId = async (req, res) => {
    const { categoryId} = req.params
    try{
        const products =  await Product.find({category: categoryId}).select("-category").exec();
        return res.send(products)

    } catch(error){
        return res.status(500).send({message: "An error occurred", error})
    }
}

export const getProductBySearch =  async (req, res) => {
    const { query } = req.query;
    console.log("query",query);
    
    if (!query) return res.status(400).json({ error: "Query is required" });

    try {
        // Fetch products from database (MongoDB example)
        const products = await Product.find({ name: { $regex: query, $options: 'i' } }); 
        console.log(products);
        
        return res.send(products);
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ error: "Server error" });
    }
};
