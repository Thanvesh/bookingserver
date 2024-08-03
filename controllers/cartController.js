// controllers/cartController.js

const Cart = require('../models/Cart');

// Get user's cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


// Add item to cart
const addItemToCart = async (req, res) => {
  const {
    propertyId,
    propertyName,
    propertyImages,
    propertyLocation,
    numAdults,
    numChildren,
    numSingle,
    numDouble,
    numTriple,
    stayType,
    startDate,
    endDate,
    numHours,
  } = req.body;

  
  

  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.propertyName === propertyName && item.startDate.getTime() === new Date(startDate).getTime()
    );


    if (itemIndex > -1) {
      // Update existing item
      const item = cart.items[itemIndex];
      item.numAdults = numAdults;
      item.numChildren = numChildren;
      item.numSingle = numSingle;
      item.numDouble = numDouble;
      item.numTriple = numTriple;
      item.stayType = stayType;
      item.startDate = new Date(startDate);
      item.endDate = stayType === 'day' ? new Date(endDate) : null;
      item.numHours = stayType === 'hours' ? numHours : null;
    } else {
      // Add new item
      cart.items.push({
        propertyId,
        propertyName,
        propertyImages,
        propertyLocation,
        numAdults,
        numChildren,
        numSingle,
        numDouble,
        numTriple,
        stayType,
        startDate: new Date(startDate),
        endDate: stayType === 'day' ? new Date(endDate) : null,
        numHours: stayType === 'hours' ? numHours : null,
      });
    }

    const updatedCart = await cart.save();
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


// Update cart item quantity (now more about full item details)
const updateCartItem = async (req, res) => {
  const {
    propertyId,
    propertyName,
    propertyImages,
    propertyLocation,
    numAdults,
    numChildren,
    numSingle,
    numDouble,
    numTriple,
    stayType,
    startDate,
    endDate,
    numHours,
  } = req.body;

  const {id} = req.params;

  try {
    // Find the user's cart
    let cart = await Cart.findOne({ user: req.user._id });


    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the index of the item to update
    const itemIndex = cart.items.findIndex(
      (item) => {  
        return (
          item._id.toString() === id        );
      }
    );
    

    if (itemIndex > -1) {
      // Update item with new details
      const item = cart.items[itemIndex];

      item.propertyId = propertyId;
      item.propertyName = propertyName;
      item.propertyImages = propertyImages;
      item.propertyLocation = propertyLocation;
      item.numAdults = numAdults;
      item.numChildren = numChildren;
      item.numSingle = numSingle;
      item.numDouble = numDouble;
      item.numTriple = numTriple;
      item.stayType = stayType;
      item.startDate = new Date(startDate);
      item.endDate = stayType === 'day' ? new Date(endDate) : null;
      item.numHours = stayType === 'hours' ? numHours : null;


      // Save updated cart
      const updatedCart = await cart.save();

      res.json(updatedCart);
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};



// Remove item from cart
const removeItemFromCart = async (req, res) => {
  const { id } = req.params; // Get the item ID from the request parameters

  try {
    // Find the cart for the logged-in user
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the index of the item to remove
    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === id
    );

    if (itemIndex > -1) {
      // Remove the item from the cart
      cart.items.splice(itemIndex, 1);
      const updatedCart = await cart.save();
      res.json(updatedCart);
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  getCart,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
};
