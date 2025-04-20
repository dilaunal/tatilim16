const express = require('express');
const cors = require('cors');
// const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// MongoDB bağlantısını geçici olarak devre dışı bıraktık
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log('MongoDB bağlantısı başarılı'))
// .catch(err => console.error('MongoDB bağlantı hatası:', err));

// CORS ayarları
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const hotelsRouter = require('./routes/hotels');
const bookingsRouter = require('./routes/bookings');
const reviewsRoutes = require('./routes/reviews');
const favoritesRoutes = require('./routes/favorites');
const campaignsRoutes = require('./routes/campaigns');
const feedbackRoutes = require('./routes/feedback');
const complaintsRoutes = require('./routes/complaints');

app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/campaigns', campaignsRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/complaints', complaintsRoutes);

// API durumunu kontrol etmek için basit bir endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Tatilim API çalışıyor',
    status: 'online',
    environment: process.env.NODE_ENV
  });
});

// Rezervasyon işlemleri için endpoint
app.post('/api/bookings', (req, res) => {
  const { hotelId, checkIn, checkOut, guests, roomType, name, email, phone } = req.body;
  
  // Burada veritabanına kayıt işlemi yapılacak
  // Şimdilik sadece başarılı yanıt dönüyoruz
  res.status(200).json({
    success: true,
    message: 'Rezervasyon başarıyla oluşturuldu',
    booking: {
      hotelId,
      checkIn,
      checkOut,
      guests,
      roomType,
      name,
      email,
      phone,
      bookingDate: new Date().toISOString()
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Bir şeyler ters gitti!' });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
}); 