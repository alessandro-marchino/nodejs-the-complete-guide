import { Schema, model } from 'mongoose';

const orderSchema = new Schema({
    products: [{
        productData: { type: Object, required: true },
        quantity: { type:Number, required: true }
    }],
    user: {
        name: { type: String, required: true },
        userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' }
    }
});
export default model('Order', orderSchema);
