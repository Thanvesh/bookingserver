const Property = require('../models/Property');

// Get all properties
const getProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single property
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (property) {
      res.json(property);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new property (Admin only)
const createProperty = async (req, res) => {
  try {
    const property = new Property(req.body);
    
    const createdProperty = await property.save();
   
    res.status(201).json(createdProperty);
  } catch (error) {
    
    res.status(500).json({ message: 'Server error' });
  }
};


// Update a property (Admin only)
const updateProperty = async (req, res) => {
  try {

    const property = await Property.findById(req.params.id);



    if (property) {
      Object.assign(property, req.body);
      const updatedProperty = await property.save();
      res.json(updatedProperty);

    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a property (Admin only)
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);


    if (property) {
      await Property.deleteOne({ _id: req.params.id });
      res.json({ message: 'Property removed' });

    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
  
    res.status(500).json({ message: 'Server error' });
  }
};

const getFavoriteProperties = async (req, res) => {
  try {
    // Extract the user ID from the authenticated user
    const userId = req.params.id;

    // Find all properties where the user's ID is in the favorites array
    const favoriteProperties = await Property.find({ favorites: userId });

    // Return the list of favorite properties
    res.json(favoriteProperties);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};





const toggleFavorite = async (req, res) => {
    try {
      const property = await Property.findById(req.params.id);
  
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
  
      const userId = req.user._id;
      const isFavorited = property.favorites.includes(userId);
  
      if (isFavorited) {
        // Remove user from favorites
        property.favorites = property.favorites.filter(id => id.toString() !== userId.toString());
      } else {
        // Add user to favorites
        property.favorites.push(userId);
      }
  
      await property.save();
      res.json({ favorites: property.favorites });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  toggleFavorite,
  getFavoriteProperties,
};
