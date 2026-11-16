const Resource = require("../models/Resource");

// Gets All Training Resources
exports.getResources = async (req, res) => {
  try {
    const resources = await Resource.find();
    res.status(200).json({ success: true, data: resources });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Get Single Training Resource
exports.getSingleResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, error: "Resource not found" });
    }
    res.status(200).json({ success: true, data: resource });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Create Training Resource
exports.createResource = async (req, res) => {
  try {
    const resource = await Resource.create(req.body);
    res.status(200).json({ success: true, data: resource });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Update Training Resource
exports.updateResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!resource) {
      return res.status(404).json({ success: false, error: "Resource not found" });
    }
    res.status(200).json({ success: true, data: resource });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Delete Training Resource
exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, error: "Resource not found" });
    }
    await resource.remove();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
