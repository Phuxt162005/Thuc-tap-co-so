const database = require("../database");

const getBranches = (req, res) => {
  database.query("SELECT * FROM Branch", (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
};

const createBranch = (req, res) => {
  const { name, address, phone } = req.body;

  // validate
  if (!name) {
    return res.status(400).json({
      message: "Tên chi nhánh không được để trống",
    });
  }

  const sql = `INSERT INTO Branch (name,address,phone) VALUES(?,?,?)`;

  database.query(sql, [name, address, phone], (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Thêm chi nhánh thành công",
    });
  });
};

const updateBranch = (req, res) => {
  const { id } = req.params;
  const { name, address, phone } = req.body;

  // validate
  if (!name) {
    return res.status(400).json({
      message: "Tên chi nhánh không được để trống",
    });
  }

  const sql = `UPDATE Branch
    SET name=?, address=?, phone=?
    WHERE branchId=?`;

  database.query(sql, [name, address, phone, id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    // check branch tồn tại
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Chi nhánh không tồn tại",
      });
    }

    res.json({
      message: "Cập nhật chi nhánh thành công",
    });
  });
};

const deleteBranch = (req, res) => {
  const { id } = req.params;

  database.query("DELETE FROM Branch WHERE branchId=?", [id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    // check branch tồn tại
    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Chi nhánh không tồn tại",
      });
    }

    res.json({
      message: "Xóa chi nhánh thành công",
    });
  });
};

module.exports = {
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch,
};
