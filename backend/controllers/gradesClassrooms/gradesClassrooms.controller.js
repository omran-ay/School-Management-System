const { pool } = require("../../config/index");
const asyncWrapper = require("../../middlewares/asyncWrapper");
const httpStatusText = require("../../utils/httpStatusText");
const appError = require("../../utils/appError");

const createGradeLevel = asyncWrapper(async (req, res, next) => {
  const { name_ar, name_en, code } = req.body;

  if (!name_ar || !code) {
    return next(appError.create("name is required", 400, httpStatusText.FAIL));
  }

  const checkQuery = `SELECT * FROM grade_levels WHERE code = $1 LIMIT 1`;
  const checkResult = await pool.query(checkQuery, [code]);
  if (checkResult.rows.length > 0) {
    return next(
      appError.create(
        "Grade level code already exists",
        400,
        httpStatusText.FAIL,
      ),
    );
  }

  const result = await pool.query(
    `INSERT INTO grade_levels (name_ar, name_en, code)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name_ar, name_en, code],
  );

  res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: result.rows[0],
  });
});

const getAllGradeLevels = asyncWrapper(async (req, res) => {
  const result = await pool.query(
    `SELECT * FROM grade_levels ORDER BY grade_id`,
  );
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: result.rows,
  });
});

const getGradeLevelById = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const result = await pool.query(
    `SELECT * FROM grade_levels WHERE grade_id = $1`,
    [id],
  );

  if (result.rows.length === 0) {
    return next(
      appError.create("Grade level not found", 404, httpStatusText.FAIL),
    );
  }

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: result.rows[0],
  });
});

const updateGradeLevel = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { name_ar, name_en, code } = req.body;

  if (!name_ar || !code) {
    return next(appError.create("name is required", 400, httpStatusText.FAIL));
  }

  const result = await pool.query(
    `UPDATE grade_levels
     SET name_ar = $1, name_en = $2, code = $3
     WHERE grade_id = $4
     RETURNING *`,
    [name_ar, name_en, code, id],
  );

  if (result.rows.length === 0) {
    return next(
      appError.create(
        "Grade level not found for update",
        404,
        httpStatusText.FAIL,
      ),
    );
  }

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: result.rows[0],
  });
});

const deleteGradeLevel = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;

  const result = await pool.query(
    `DELETE FROM grade_levels WHERE grade_id = $1 RETURNING *`,
    [id],
  );

  if (result.rows.length === 0) {
    return next(
      appError.create(
        "Grade level not found for deletion",
        404,
        httpStatusText.FAIL,
      ),
    );
  }

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    message: "Grade level deleted successfully",
  });
});

module.exports = {
  createGradeLevel,
  getAllGradeLevels,
  getGradeLevelById,
  updateGradeLevel,
  deleteGradeLevel,
};
