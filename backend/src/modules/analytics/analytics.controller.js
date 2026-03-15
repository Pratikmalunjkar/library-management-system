const analyticsService = require("./analytics.service");

const getOverviewAnalytics = async (req, res) => {
  try {
    const analytics = await analyticsService.getOverviewAnalytics();
    res.status(200).json({ analytics });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getBookAnalytics = async (req, res) => {
  try {
    const analytics = await analyticsService.getBookAnalytics();
    res.status(200).json({ analytics });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getOverviewAnalytics,
  getBookAnalytics
};