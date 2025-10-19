const connection = require('../event_db');

// 获取所有分类
exports.getAllCategories = (req, res) => {
  const query = 'SELECT id, name, description FROM categories ORDER BY name';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
  });
};

// 添加新分类
exports.createCategory = (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Category name is required.' });
  }

  const query = 'INSERT INTO categories (name, description) VALUES (?, ?)';
  connection.query(query, [name, description || null], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(201).json({ message: 'Category created successfully.', category_id: result.insertId });
  });
};

// 更新分类
exports.updateCategory = (req, res) => {
  const categoryId = req.params.id;
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Category name is required.' });
  }

  const query = 'UPDATE categories SET name = ?, description = ? WHERE id = ?';
  connection.query(query, [name, description || null, categoryId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json({ message: 'Category updated successfully.' });
  });
};

// 删除分类
exports.deleteCategory = (req, res) => {
  const categoryId = req.params.id;

  // 检查是否有事件使用该分类
  const checkQuery = 'SELECT id FROM events WHERE category_id = ? LIMIT 1';
  connection.query(checkQuery, [categoryId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'Cannot delete category, some events are using it.' });
    }

    const deleteQuery = 'DELETE FROM categories WHERE id = ?';
    connection.query(deleteQuery, [categoryId], (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json({ message: 'Category deleted successfully.' });
    });
  });
};
