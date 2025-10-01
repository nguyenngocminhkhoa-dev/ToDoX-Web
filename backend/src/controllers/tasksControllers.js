import Task from "../models/Task.js";

export const getAllTasks = async (req, res) => {
  //viết bộ lọc
  const { filter = "today" } = req.query;
  const now = new Date();
  let startDate;

  switch (filter) {
    case "today": {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    }
    case "week": {
      const MondayDate =
        now.getDate - (now.getDay() - 1) - (now.getDay === 0 ? 7 : 0);
      startDate = new Date(now.getFullYear(), now.getMonth, MondayDate);
      break;
    }
    case "month": {
      (startDate = new Date(now.getFullYear(), now.getMonth)), 1;
      break;
    }
    case "all":
    default: {
      startDate = null;
    }
  }

  const query = startDate ? { createdAt: { $gte: startDate } } : {};
  try {
    // const tasks = await Task.find().sort({ createAt: -1 });
    //thay vì phải viết điều kiện quá nhiều thì ta nên dùng aggregate
    const resuft = await Task.aggregate([
      {
        $facet: {
          tasks: [{ $sort: { createdAt: -1 } }],
          activeCount: [{ $match: { status: "active" } }, { $count: "count" }],
          completeCount: [
            { $match: { status: "complete" } },
            { $count: "count" },
          ],
        },
      },
    ]);
    const task = resuft[0].tasks;
    const activeCount = resuft[0].activeCount;
    const completeCount = resuft[0].completeCount;
    return res.status(200).json({ task, activeCount, completeCount });
  } catch (error) {
    console.error("Lỗi getAllTasks:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export const createTask = async (req, res) => {
  try {
    const { title } = req.body;
    const task = new Task({ title });

    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Lỗi khi gọi createTask", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export const updateTask = async (req, res) => {
  try {
    const { title, status, completedAt } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        status,
        completedAt,
      },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Nhiệm vụ không tồn tại" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Lỗi khi gọi updateTask", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export const deleteTask = async (req, res) => {
  try {
    const deleteTask = await Task.findByIdAndDelete(req.params.id);

    if (!deleteTask) {
      return res.status(404).json({ message: "Nhiệm vụ không tồn tại" });
    }

    res.status(200).json(deleteTask);
  } catch (error) {
    console.error("Lỗi khi gọi deleteTask", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
