// routes/index.js
const express = require('express');
const router = express.Router();

console.log('Routes loaded successfully');

// Basic home route
router.get('/', (req, res) => {
    res.json({
        message: 'WAD03_trinity API Server is running!',
        version: '1.0.0',
        status: 'OK',
        team: 'Trinity Team'
    });
});

// Greeting route
router.get('/greeting', (req, res) => {
    try {
        // Bisa ambil nama dari query parameter atau default
        const name = req.query.name || 'Pengunjung';
        
        // Response greeting
        res.json({
            success: true,
            message: `Halo ${name}, selamat datang di aplikasi Trinity!`,
            timestamp: new Date().toISOString(),
            data: {
                greeting: "Ini adalah aplikasi Trinity. Let's take a look!",
                user: name,
                status: "active"
            }
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server",
            error: error.message
        });
    }
});

// Alternative greeting dengan parameter
router.get('/greeting/:name', (req, res) => {
    try {
        const name = req.params.name;
        
        res.json({
            success: true,
            message: `Halo ${name}, selamat datang di aplikasi Trinity`,
            timestamp: new Date().toISOString(),
            data: {
                greeting: "Ini adalah aplikasi Trinity. Let's take a look!",
                user: name,
                status: "active"
            }
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server",
            error: error.message
        });
    }
});

// POST method untuk greeting dengan data dari body
router.post('/greeting', (req, res) => {
    try {
        const { name, message } = req.body;
        
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Nama harus diisi"
            });
        }
        
        res.json({
            success: true,
            message: `Halo ${name}! ${message || 'Terima kasih sudah berkunjung!'}`,
            timestamp: new Date().toISOString(),
            data: {
                greeting: "Pesan berhasil diterima",
                user: name,
                userMessage: message,
                status: "processed"
            }
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server",
            error: error.message
        });
    }
});

module.exports = router;