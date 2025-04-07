import Cart from '../models/cart.js';
import Product from '../models/product.js';

const getOrCreateCart = async (userId) => {
    return await Cart.findOne({ userId }) || new Cart({ userId, items: [], totalPrice: 0 }).save();
};
export const addToCart = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

        const cart = await getOrCreateCart(userId);
        await cart.addItem(productId, quantity);

        res.status(200).json({ message: "Item được thêm vào giỏ hàng", cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const removeFromCart = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { productId } = req.body;

        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });

        await cart.removeItem(productId);
        res.status(200).json({ message: "Item được xóa khỏi giỏ hàng", cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const clearCart = async (req, res) => {
    try {
        const { id: userId } = req.user;

        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });

        await cart.clearCart();
        res.status(200).json({ message: "Giỏ hàng đã được dọn sạch", cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCart = async (req, res) => {
    try {
        let cart = await getOrCreateCart(req.user.id);
        cart = await cart.populate("items.productId");

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCartItemQuantity = async (req, res) => {
    try {
        const { id: userId } = req.user;
        let { productId, quantity } = req.body;

        // Convert quantity to a number and validate
        quantity = Number(quantity);
        if (isNaN(quantity) || quantity < 1) {
            return res.status(400).json({ message: "Số lượng không hợp lệ" });
        }

        let cart = await Cart.findOne({ userId }).populate("items.productId");
        if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });

        const itemIndex = cart.items.findIndex(item => item.productId._id.toString() === productId);
        if (itemIndex === -1) return res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" });

        // Update quantity
        cart.items[itemIndex].quantity = quantity;

        cart.totalPrice = cart.items.reduce((sum, item) => {
            const itemPrice = Number(item.productId?.price) || 0; 
            const itemQuantity = Number(item.quantity) || 0; 
            return sum + itemPrice * itemQuantity;
        }, 0);

        await cart.save();
        res.status(200).json({ message: "Đã cập nhật số lượng", cart });

    } catch (error) {
        console.error("Error updating cart:", error); // Debugging log
        res.status(500).json({ message: error.message });
    }
};
