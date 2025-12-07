
import Task from "../models/taskmodel.js";
import User from "../models/usermodel.js";
import Dispute from "../models/disputemodel.js";

export const getAdminStats = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const totalUsers = await User.countDocuments();
    const pendingApprovals = await User.countDocuments({ approved: false });

    const activeTasks = await Task.countDocuments({
      status: { $in: ["todo", "in_progress"] }
    });

    const disputes = await Dispute.countDocuments();

    res.status(200).json({
      totalUsers,
      pendingApprovals,
      activeTasks,
      disputes
    });

  } catch (err) {
    console.error("Error fetching admin stats:", err);
    res.status(500).json({ message: err.message });
  }
};
