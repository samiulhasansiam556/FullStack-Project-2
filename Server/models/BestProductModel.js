

import mongoose from 'mongoose';

const BestProductSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  addedAt: { type: Date, default: Date.now },
});

const BestProduct = mongoose.model('BestProduct', BestProductSchema);
export default BestProduct