const express = require('express');
const router = express.Router();
const db = require('../db');

// Ensure "General" category exists (helper function)
async function ensureGeneralCategory() {
  try {
    const generalCheck = await db.query(
      "SELECT category_id FROM categories WHERE LOWER(category_name) = 'general'"
    );
    
    if (generalCheck.rows.length === 0) {
      await db.query(
        `INSERT INTO categories (category_name, status) 
         VALUES ('General', 'active')
         ON CONFLICT DO NOTHING`
      );
    }
  } catch (err) {
    console.error('Error ensuring General category:', err);
  }
}

// Get all categories with sub-categories count
router.get('/', async (req, res) => {
  try {
    // Ensure General category exists
    await ensureGeneralCategory();
    
    const result = await db.query(
      `SELECT 
        c.category_id,
        c.category_name,
        c.status,
        c.created_at,
        COUNT(DISTINCT sc.sub_category_id) as sub_category_count
      FROM categories c
      LEFT JOIN sub_categories sc ON c.category_id = sc.category_id AND sc.status = 'active'
      GROUP BY c.category_id, c.category_name, c.status, c.created_at
      ORDER BY 
        CASE WHEN LOWER(c.category_name) = 'general' THEN 0 ELSE 1 END,
        c.category_name ASC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories', message: error.message });
  }
});

// Get single category with sub-categories
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [categoryResult, subCategoriesResult] = await Promise.all([
      db.query('SELECT * FROM categories WHERE category_id = $1', [id]),
      db.query(
        'SELECT * FROM sub_categories WHERE category_id = $1 ORDER BY sub_category_name ASC',
        [id]
      )
    ]);
    
    if (categoryResult.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json({
      ...categoryResult.rows[0],
      sub_categories: subCategoriesResult.rows
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category', message: error.message });
  }
});

// Create new category
router.post('/', async (req, res) => {
  try {
    const { category_name, status } = req.body;

    if (!category_name || !category_name.trim()) {
      return res.status(400).json({ error: 'Product Group name is required' });
    }

    // Prevent creating another "General" category
    if (category_name.trim().toLowerCase() === 'general') {
      return res.status(400).json({ error: 'Product Group "General" already exists and cannot be created again' });
    }

    // Ensure General category exists
    await ensureGeneralCategory();

    const result = await db.query(
      `INSERT INTO categories (category_name, status)
       VALUES ($1, $2)
       RETURNING *`,
      [category_name.trim(), status || 'active']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating category:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Product Group name already exists' });
    }
    res.status(500).json({ error: 'Failed to create Product Group', message: error.message });
  }
});

// Update category
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name, status } = req.body;

    // Check if this is the General category
    const categoryCheck = await db.query(
      'SELECT category_name FROM categories WHERE category_id = $1',
      [id]
    );

    if (categoryCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Product Group not found' });
    }

    const isGeneral = categoryCheck.rows[0].category_name.toLowerCase() === 'general';

    // Prevent renaming General category
    if (category_name && category_name.trim().toLowerCase() !== 'general' && isGeneral) {
      return res.status(400).json({ error: 'Cannot rename "General" Product Group' });
    }

    // Prevent changing General to inactive
    if (status === 'inactive' && isGeneral) {
      return res.status(400).json({ error: 'Cannot deactivate "General" Product Group' });
    }

    if (!category_name || !category_name.trim()) {
      return res.status(400).json({ error: 'Product Group name is required' });
    }

    const result = await db.query(
      `UPDATE categories 
       SET category_name = $1, status = $2
       WHERE category_id = $3
       RETURNING *`,
      [category_name.trim(), status || 'active', id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product Group not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating category:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Product Group name already exists' });
    }
    res.status(500).json({ error: 'Failed to update Product Group', message: error.message });
  }
});

// Delete category (only if no products use it, and not General)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if this is the General category
    const categoryCheck = await db.query(
      'SELECT category_name FROM categories WHERE category_id = $1',
      [id]
    );

    if (categoryCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Product Group not found' });
    }

    const isGeneral = categoryCheck.rows[0].category_name.toLowerCase() === 'general';

    // Prevent deleting General category
    if (isGeneral) {
      return res.status(400).json({ 
        error: 'Cannot delete "General" Product Group. It is required by the system.' 
      });
    }
    
    const productsCheck = await db.query(
      'SELECT COUNT(*) as count FROM products WHERE category_id = $1',
      [id]
    );

    const productsCount = parseInt(productsCheck.rows[0].count);

    if (productsCount > 0) {
      // Move products to General category before deletion
      const generalResult = await db.query(
        "SELECT category_id FROM categories WHERE LOWER(category_name) = 'general'"
      );
      
      if (generalResult.rows.length > 0) {
        const generalCategoryId = generalResult.rows[0].category_id;
        await db.query(
          'UPDATE products SET category_id = $1 WHERE category_id = $2',
          [generalCategoryId, id]
        );
      }
    }

    const result = await db.query(
      'DELETE FROM categories WHERE category_id = $1 RETURNING category_id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product Group not found' });
    }

    res.json({ message: 'Product Group deleted successfully', category_id: id });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete Product Group', message: error.message });
  }
});

// ============================================
// SUB-CATEGORIES ROUTES
// ============================================

// Get all sub-categories
router.get('/sub-categories/all', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT 
        sc.sub_category_id,
        sc.category_id,
        sc.sub_category_name,
        sc.status,
        c.category_name,
        sc.created_at
      FROM sub_categories sc
      JOIN categories c ON sc.category_id = c.category_id
      ORDER BY c.category_name, sc.sub_category_name ASC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching sub-categories:', error);
    res.status(500).json({ error: 'Failed to fetch sub-categories', message: error.message });
  }
});

// Create sub-category
router.post('/sub-categories', async (req, res) => {
  try {
    const { category_id, sub_category_name, status } = req.body;

    if (!category_id) {
      return res.status(400).json({ error: 'Category ID is required' });
    }

    if (!sub_category_name || !sub_category_name.trim()) {
      return res.status(400).json({ error: 'Sub-category name is required' });
    }

    const result = await db.query(
      `INSERT INTO sub_categories (category_id, sub_category_name, status)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [category_id, sub_category_name.trim(), status || 'active']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating sub-category:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Sub-category name already exists for this category' });
    }
    if (error.code === '23503') {
      return res.status(400).json({ error: 'Invalid category ID' });
    }
    res.status(500).json({ error: 'Failed to create sub-category', message: error.message });
  }
});

// Update sub-category
router.put('/sub-categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { sub_category_name, status } = req.body;

    if (!sub_category_name || !sub_category_name.trim()) {
      return res.status(400).json({ error: 'Sub-category name is required' });
    }

    const result = await db.query(
      `UPDATE sub_categories 
       SET sub_category_name = $1, status = $2
       WHERE sub_category_id = $3
       RETURNING *`,
      [sub_category_name.trim(), status || 'active', id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sub-category not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating sub-category:', error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Sub-category name already exists for this category' });
    }
    res.status(500).json({ error: 'Failed to update sub-category', message: error.message });
  }
});

// Delete sub-category
router.delete('/sub-categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const productsCheck = await db.query(
      'SELECT COUNT(*) as count FROM products WHERE sub_category_id = $1',
      [id]
    );

    const productsCount = parseInt(productsCheck.rows[0].count);

    if (productsCount > 0) {
      return res.status(400).json({ 
        error: `Cannot delete sub-category: used by ${productsCount} product(s)` 
      });
    }

    const result = await db.query(
      'DELETE FROM sub_categories WHERE sub_category_id = $1 RETURNING sub_category_id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sub-category not found' });
    }

    res.json({ message: 'Sub-category deleted successfully', sub_category_id: id });
  } catch (error) {
    console.error('Error deleting sub-category:', error);
    res.status(500).json({ error: 'Failed to delete sub-category', message: error.message });
  }
});

module.exports = router;







