const Order = require('../models/Order');
const Property = require('../models/Property');

// Get all orders for a logged-in user
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { email, name, paymentMethod, orderDetails } = req.body;
    const userId = req.user._id;

    const createdOrders = [];

    for (const orderItem of orderDetails) {
      const {
        propertyId,
        propertyName,
        propertyImages,
        propertyLocation,
        startDate,
        endDate,
        stayType,
        totalPrice,
        numAdults,
        numChildren,
        numSingle,
        numDouble,
        numTriple,
        numHours,
      } = orderItem;

      const propertyData = await Property.findById(propertyId);
      if (!propertyData) {
        return res.status(404).json({ message: 'Property not found' });
      }

      if (propertyData.rooms) {
        propertyData.rooms.single -= numSingle;
        propertyData.rooms.double -= numDouble;
        propertyData.rooms.triple -= numTriple;
      }

      await propertyData.save();

      const newOrder = new Order({
        user: userId,
        property: propertyData._id,
        email,
        name,
        paymentMethod,
        orderDetails: [{
          propertyName,
          propertyImages,
          propertyLocation,
          startDate,
          endDate,
          stayType,
          totalPrice,
          numAdults,
          numChildren,
          numSingle,
          numDouble,
          numTriple,
          numHours,
        }],
      });

      const createdOrder = await newOrder.save();
      createdOrders.push(createdOrder);
    }

    res.status(201).json({ message: 'Orders placed successfully', orders: createdOrders });
  } catch (error) {
    console.error('Order placement failed', error);
    res.status(500).json({ message: 'Server error', error });
  }
};



// Cancel an order for a logged-in user
const cancelUserOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    console.log("checking find",order)

    if (order) {
      // Restore the room availability for the cancelled order
      const propertyData = await Property.findById(order.property);
      console.log("checkingProperty",propertyData.rooms)
      if (propertyData.rooms) {
        propertyData.rooms.single += order.orderDetails[0].numSingle;
        propertyData.rooms.double +=order.orderDetails[0].numDouble;
        propertyData.rooms.triple +=order.orderDetails[0].numTriple;
      }
     
      await propertyData.save();
      console.log("checkingProperty",propertyData.rooms)


      await order.deleteOne();
      res.json({ message: 'Order cancelled and removed' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUserOrders,
  createOrder,
  cancelUserOrder,
};
