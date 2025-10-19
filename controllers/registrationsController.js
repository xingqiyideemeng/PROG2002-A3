const connection = require('../event_db');

// 添加注册记录
exports.createRegistration = (req, res) => {
  const { event_id, full_name, email, contact_phone, tickets_count } = req.body;

  // 基本验证
  if (!event_id || !full_name || !email || !tickets_count) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  // 检查是否已注册
  const checkQuery = `
    SELECT id FROM registrations 
    WHERE event_id = ? AND email = ?
  `;
  connection.query(checkQuery, [event_id, email], (err, results) => {
    if (err) {
      console.error('Database error (check):', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'You have already registered for this event.' });
    }

    // 插入注册记录
    const insertQuery = `
      INSERT INTO registrations (event_id, full_name, email, contact_phone, tickets_count)
      VALUES (?, ?, ?, ?, ?)
    `;

    connection.query(
      insertQuery,
      [event_id, full_name, email, contact_phone, tickets_count],
      (err, result) => {
        if (err) {
          console.error('Database error (insert):', err);
          return res.status(500).json({ error: 'Failed to save registration.' });
        }

        res.status(201).json({
          message: 'Registration successful!',
          registration_id: result.insertId
        });
      }
    );
  });
};

// 获取指定活动的注册列表
exports.getRegistrationsByEvent = (req, res) => {
  const eventId = req.params.eventId;

  const query = `
    SELECT id, full_name, email, contact_phone, tickets_count, registered_at
    FROM registrations
    WHERE event_id = ?
    ORDER BY registered_at DESC
  `;

  connection.query(query, [eventId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
  });
};
