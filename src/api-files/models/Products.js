const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productConfig = {
  type: String,
  required: true,
};
const dateConfig = {
  type: Date,
  default: new Date(),
  required: false,
};

const ProductsModel = new Schema({
  user_id: productConfig,
  prod_name: productConfig,
  prod_weight: productConfig,
  farmer_name: productConfig,
  prod_add_date: dateConfig,
  prod_exp_date: dateConfig,
  created_at: dateConfig,
  notifications_sent: {
    type: Number,
    default: 0,
  },
});

const Products =
  mongoose.models.Products || mongoose.model("Products", ProductsModel);

export default Products;
