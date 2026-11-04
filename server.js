const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-iQbE8Wd-umnIaxcXcE6MA75q';
const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY || 'SB-Mid-client-iQbE8Wd-umnIaxcXcE6MA75q';
const IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === 'true';

const SNAP_API_HOST = IS_PRODUCTION ? 'app.midtrans.com' : 'app.sandbox.midtrans.com';
const CORE_API_HOST = IS_PRODUCTION ? 'api.midtrans.com' : 'api.sandbox.midtrans.com';

const ORDERS_FILE = path.join(__dirname, 'orders.json');

// Helper to read orders
function getOrders() {
    try {
        if (fs.existsSync(ORDERS_FILE)) {
            const data = fs.readFileSync(ORDERS_FILE, 'utf8');
            return JSON.parse(data || '[]');
        }
    } catch (e) {
        console.error('Gagal membaca orders.json:', e);
    }
    return [];
}

// Helper to save order
function saveOrder(order) {
    try {
        const orders = getOrders();
        const existingIdx = orders.findIndex(o => o.order_id === order.order_id);
        if (existingIdx >= 0) {
            orders[existingIdx] = { ...orders[existingIdx], ...order, updated_at: new Date().toISOString() };
        } else {
            orders.unshift({ ...order, created_at: new Date().toISOString() });
        }
        fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');
    } catch (e) {
        console.error('Gagal menyimpan orders.json:', e);
    }
}

// Helper MIME Types
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain; charset=utf-8'
};

// Set CORS headers
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
}

// Helper to make HTTPS request to Midtrans
function callMidtrans(hostname, apiPath, method, data = null) {
    return new Promise((resolve, reject) => {
        const authHeader = 'Basic ' + Buffer.from(MIDTRANS_SERVER_KEY + ':').toString('base64');
        const headers = {
            'Accept': 'application/json',
            'Authorization': authHeader
        };

        let postBody = null;
        if (data && (method === 'POST' || method === 'PUT')) {
            postBody = JSON.stringify(data);
            headers['Content-Type'] = 'application/json';
            headers['Content-Length'] = Buffer.byteLength(postBody);
        }

        const req = https.request({
            hostname: hostname,
            path: apiPath,
            method: method,
            headers: headers
        }, (res) => {
            let body = '';
            res.on('data', chunk => { body += chunk; });
            res.on('end', () => {
                let parsed = null;
                try {
                    parsed = JSON.parse(body);
                } catch (err) {
                    parsed = { raw: body };
                }
                resolve({
                    statusCode: res.statusCode,
                    data: parsed
                });
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        if (postBody) {
            req.write(postBody);
        }
        req.end();
    });
}

const server = http.createServer((req, res) => {
    setCorsHeaders(res);

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // API: Config (Client Key & Environment)
    if (pathname === '/api/midtrans/config' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            client_key: MIDTRANS_CLIENT_KEY,
            is_production: IS_PRODUCTION,
            snap_script_url: IS_PRODUCTION
                ? 'https://app.midtrans.com/snap/snap.js'
                : 'https://app.sandbox.midtrans.com/snap/snap.js'
        }));
        return;
    }

    // API: Create Snap Transaction
    if (pathname === '/api/midtrans/charge' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
            try {
                const payload = JSON.parse(body || '{}');

                if (!payload.order_id || !payload.gross_amount) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'order_id dan gross_amount wajib disertakan.' }));
                    return;
                }

                // Midtrans Snap Payload formatting
                const midtransPayload = {
                    transaction_details: {
                        order_id: String(payload.order_id),
                        gross_amount: Math.round(Number(payload.gross_amount))
                    },
                    customer_details: {
                        first_name: payload.customer_name || 'Pelanggan Lumière Bites',
                        email: payload.customer_email || 'customer@example.com',
                        phone: payload.customer_phone || ''
                    }
                };

                // Add item details if provided
                if (Array.isArray(payload.item_details) && payload.item_details.length > 0) {
                    midtransPayload.item_details = payload.item_details.map((item, idx) => ({
                        id: String(item.id || ('ITEM-' + (idx + 1))),
                        price: Math.round(Number(item.price)),
                        quantity: Math.max(1, Math.round(Number(item.quantity))),
                        name: String(item.name).slice(0, 50)
                    }));
                }

                const response = await callMidtrans(
                    SNAP_API_HOST,
                    '/snap/v1/transactions',
                    'POST',
                    midtransPayload
                );

                if (response.statusCode >= 200 && response.statusCode < 300) {
                    // Record in local orders storage
                    saveOrder({
                        order_id: payload.order_id,
                        gross_amount: payload.gross_amount,
                        customer: midtransPayload.customer_details,
                        items: payload.item_details || [],
                        notes: payload.notes || '',
                        status: 'pending',
                        snap_token: response.data.token,
                        redirect_url: response.data.redirect_url
                    });

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        token: response.data.token,
                        redirect_url: response.data.redirect_url,
                        order_id: payload.order_id
                    }));
                } else {
                    res.writeHead(response.statusCode, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: false,
                        error: response.data
                    }));
                }
            } catch (err) {
                console.error('Error saat membuat transaksi Midtrans:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message || 'Terjadi kesalahan internal server.' }));
            }
        });
        return;
    }

    // API: Check Transaction Status
    if (pathname.startsWith('/api/midtrans/status/') && req.method === 'GET') {
        const orderId = decodeURIComponent(pathname.replace('/api/midtrans/status/', ''));
        if (!orderId) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Order ID tidak ditemukan.' }));
            return;
        }

        callMidtrans(CORE_API_HOST, `/v2/${encodeURIComponent(orderId)}/status`, 'GET')
            .then(response => {
                if (response.statusCode === 200 && response.data && response.data.transaction_status) {
                    // Update stored order status
                    saveOrder({
                        order_id: orderId,
                        status: response.data.transaction_status,
                        payment_type: response.data.payment_type,
                        settlement_time: response.data.settlement_time
                    });
                }
                res.writeHead(response.statusCode, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(response.data));
            })
            .catch(err => {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            });
        return;
    }

    // API: Midtrans Webhook Notification
    if (pathname === '/api/midtrans/notification' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const notif = JSON.parse(body || '{}');
                console.log('Notifikasi Midtrans Diterima:', notif.order_id, notif.transaction_status);

                if (notif.order_id) {
                    saveOrder({
                        order_id: notif.order_id,
                        status: notif.transaction_status,
                        payment_type: notif.payment_type,
                        fraud_status: notif.fraud_status,
                        settlement_time: notif.settlement_time || new Date().toISOString()
                    });
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'OK' }));
            } catch (err) {
                console.error('Error saat memproses notifikasi Midtrans:', err);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Payload tidak valid' }));
            }
        });
        return;
    }

    // API: Get All Orders (for Admin)
    if (pathname === '/api/orders' && req.method === 'GET') {
        const orders = getOrders();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(orders));
        return;
    }

    // Serve Static Files
    let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
    filePath = path.normalize(filePath);

    // Prevent directory traversal
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // If file doesn't exist, try adding .html
            if (fs.existsSync(filePath + '.html')) {
                filePath = filePath + '.html';
            } else {
                res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end('<h1>404 Not Found - Halaman tidak ditemukan</h1><p><a href="/">Kembali ke Beranda</a></p>');
                return;
            }
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, { 'Content-Type': contentType });
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    });
});

server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Lumière Bites Server berjalan di: http://localhost:${PORT}`);
    console.log(`💳 Midtrans Gateway: SANDBOX ACTIVE`);
    console.log(`🔑 Server Key: ${MIDTRANS_SERVER_KEY.slice(0, 15)}...`);
    console.log(`======================================================\n`);
});
