import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [ {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        } ]
    }
});
userSchema.methods.addToCart = function(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => cp.productId.equals(product._id));
    let newQuantity = 1;
    let updatedCartItems = [ ...this.cart.items ];
    if(cartProductIndex !== -1) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({
            productId: product,
            quantity: newQuantity
        })
    }
    const updatedCart = { items: updatedCartItems };
    this.cart = updatedCart;
    return this.save();
}
userSchema.methods.deleteItemFromCart = function(productId) {
    const updatedCartItems = this.cart.items.filter(cp => !cp.productId.equals(productId));
    this.cart = { items: updatedCartItems };
    return this.save();
}
export default model('User', userSchema);
