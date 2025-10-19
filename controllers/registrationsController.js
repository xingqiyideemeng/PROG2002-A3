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

// 管理员获取所有注册
exports.getAllRegistrations = (req, res) => {
  const query = `
    SELECT r.id, r.event_id, e.name as event_name,
           r.full_name, r.email, r.contact_phone, r.tickets_count, r.registered_at
    FROM registrations r
    JOIN events e ON r.event_id = e.id
    ORDER BY r.registered_at DESC
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
  });
};

// 管理员删除注册
exports.deleteRegistration = (req, res) => {
  const registrationId = req.params.id;

  const query = 'DELETE FROM registrations WHERE id = ?';
  connection.query(query, [registrationId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json({ message: 'Registration deleted successfully' });
  });
};

// 管理员更新注册信息
exports.updateRegistration = (req, res) => {
  const registrationId = req.params.id;
  const { full_name, email, contact_phone, tickets_count } = req.body;

  const query = `
    UPDATE registrations
    SET full_name = ?, email = ?, contact_phone = ?, tickets_count = ?
    WHERE id = ?
  `;

  connection.query(
    query,
    [full_name, email, contact_phone, tickets_count, registrationId],
    (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json({ message: 'Registration updated successfully' });
    }
  );
};
