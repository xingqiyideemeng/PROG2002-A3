const connection = require('../event_db');

exports.getHomeEvents = (req, res) => {
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const query = `
        SELECT 
            e.id, e.name, e.short_description, e.image_url,
            e.venue_name, e.city, e.state_region,
            e.start_at, e.end_at, e.ticket_price_cents,
            e.currency, e.tickets_sold, e.tickets_total,
            e.goal_amount_cents, e.amount_raised_cents,
            c.name as category_name,
            o.name as org_name
        FROM events e
        JOIN categories c ON e.category_id = c.id
        JOIN organizations o ON e.org_id = o.id
        WHERE e.is_suspended = 0 
        AND e.end_at >= ?
        ORDER BY e.start_at ASC
    `;

    connection.query(query, [currentDate], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
};

exports.searchEvents = (req, res) => {
    const { category, city, date } = req.query;
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    let query = `
        SELECT 
            e.id, e.name, e.short_description, e.image_url,
            e.venue_name, e.city, e.state_region,
            e.start_at, e.end_at, e.ticket_price_cents,
            c.name as category_name,
            o.name as org_name
        FROM events e
        JOIN categories c ON e.category_id = c.id
        JOIN organizations o ON e.org_id = o.id
        WHERE e.is_suspended = 0 
        AND e.end_at >= ?
    `;

    const params = [currentDate];

    if (category && category !== 'all') {
        query += ' AND c.name = ?';
        params.push(category);
    }

    if (city && city.trim() !== '') {
        query += ' AND (e.city LIKE ? OR e.state_region LIKE ?)';
        params.push(`%${city}%`, `%${city}%`);
    }

    if (date) {
        query += ' AND DATE(e.start_at) = ?';
        params.push(date);
    }

    query += ' ORDER BY e.start_at ASC';

    connection.query(query, params, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
};

exports.getCategories = (req, res) => {
    const query = 'SELECT id, name FROM categories ORDER BY name';

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
};

exports.getEventDetails = (req, res) => {
    const eventId = req.params.id;

    const query = `
        SELECT 
            e.*,
            c.name as category_name,
            o.name as org_name, o.description as org_description,
            o.contact_email, o.contact_phone, o.website
        FROM events e
        JOIN categories c ON e.category_id = c.id
        JOIN organizations o ON e.org_id = o.id
        WHERE e.id = ? AND e.is_suspended = 0
    `;

    connection.query(query, [eventId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json(results[0]);
    });
};

// 管理员获取所有事件
exports.getAllEvents = (req, res) => {
    const query = `
        SELECT 
            e.*, 
            c.name as category_name, 
            o.name as org_name
        FROM events e
        JOIN categories c ON e.category_id = c.id
        JOIN organizations o ON e.org_id = o.id
        ORDER BY e.start_at ASC
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
};

// 添加新事件
exports.createEvent = (req, res) => {
    const {
        org_id,
        category_id,
        name,
        short_description,
        full_description,
        image_url,
        venue_name,
        venue_address,
        city,
        state_region,
        postcode,
        country,
        start_at,
        end_at,
        ticket_price_cents,
        currency,
        tickets_total,
        goal_amount_cents
    } = req.body;

    const query = `
        INSERT INTO events 
        (org_id, category_id, name, short_description, full_description, image_url,
         venue_name, venue_address, city, state_region, postcode, country,
         start_at, end_at, ticket_price_cents, currency, tickets_total, goal_amount_cents)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
        org_id, category_id, name, short_description || null, full_description || null, image_url || null,
        venue_name || null, venue_address || null, city || null, state_region || null, postcode || null, country || 'Australia',
        start_at, end_at, ticket_price_cents || 0, currency || 'AUD', tickets_total || null, goal_amount_cents || null
    ];

    connection.query(query, params, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ message: 'Event created', eventId: results.insertId });
    });
};

