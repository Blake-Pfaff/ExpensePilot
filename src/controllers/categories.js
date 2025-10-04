const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/**
 * Create a new category
 * POST /api/categories
 */
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if category already exists
    const existingCategory = await prisma.category.findUnique({
      where: { name },
    });

    if (existingCategory) {
      return res.status(400).json({
        error: "Category with this name already exists.",
      });
    }

    const category = await prisma.category.create({
      data: { name },
    });

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({
      error: "Failed to create category.",
    });
  }
};

/**
 * Get all categories
 * GET /api/categories
 */
const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        _count: {
          select: { expenses: true },
        },
      },
    });

    res.json({
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      error: "Failed to get categories.",
    });
  }
};

/**
 * Get single category by ID
 * GET /api/categories/:id
 */
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: { expenses: true },
        },
      },
    });

    if (!category) {
      return res.status(404).json({
        error: "Category not found.",
      });
    }

    res.json({ category });
  } catch (error) {
    console.error("Get category by ID error:", error);
    res.status(500).json({
      error: "Failed to get category.",
    });
  }
};

/**
 * Update a category
 * PUT /api/categories/:id
 */
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingCategory) {
      return res.status(404).json({
        error: "Category not found.",
      });
    }

    // Check if new name already exists (if changing name)
    if (name && name !== existingCategory.name) {
      const duplicateName = await prisma.category.findUnique({
        where: { name },
      });

      if (duplicateName) {
        return res.status(400).json({
          error: "Category with this name already exists.",
        });
      }
    }

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name },
    });

    res.json({
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({
      error: "Failed to update category.",
    });
  }
};

/**
 * Delete a category
 * DELETE /api/categories/:id
 */
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingCategory) {
      return res.status(404).json({
        error: "Category not found.",
      });
    }

    await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({
      error: "Failed to delete category.",
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
