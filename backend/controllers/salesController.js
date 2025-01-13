const Order = require("../models/Order");

exports.getSalesData = async (req, res) => {
  const { range } = req.query;

  let startDate;
  let endDate = new Date();

  switch (range) {
    case "daily":
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      break;
    case "weekly":
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      break;
    case "monthly":
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case "previous_week":
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 14);
      endDate.setDate(endDate.getDate() - 7);
      break;
    case "previous_month":
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 2);
      endDate.setMonth(endDate.getMonth() - 1);
      break;
    case "previous_day":
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 2);
      endDate.setDate(endDate.getDate() - 1);
      break;
    default:
      return res.status(400).json({ error: "Invalid range" });
  }

  try {
    const salesData = await Order.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: range === "daily" ? "%H:00" : "%Y-%m-%d",
              date: "$date",
            },
          },
          totalSales: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
          ordersCount: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    const formattedData = salesData.map((entry) => ({
      label: entry._id,
      sales: entry.totalSales,
      orders: entry.ordersCount,
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    res.status(500).json({ error: "Error fetching sales data" });
  }
};
