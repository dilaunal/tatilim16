const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Şikayet şeması
const complaintSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: String,
  createdAt: { type: Date, default: Date.now }
});

const Complaint = mongoose.model('Complaint', complaintSchema);

// Örnek şikayetleri ekle (sadece ilk çalıştırmada)
const addSampleComplaints = async () => {
  try {
    const count = await Complaint.countDocuments();
    if (count === 0) {
      const sampleComplaints = [
        {
          title: 'Oda Temizliği Sorunu',
          description: 'Odamız yeterince temiz değildi ve personel ilgisizdi. Bir daha tercih etmeyeceğim.',
          status: 'Beklemede'
        },
        {
          title: 'Yemek Kalitesi',
          description: 'Plaj güzeldi ama yemekler kötüydü. Menü yeterince çeşitli değildi.',
          status: 'İnceleniyor'
        },
        {
          title: 'Isıtma Sistemi Arızası',
          description: 'Isıtma sistemi çalışmıyordu ve oda çok soğuktu. Defalarca bildirmemize rağmen düzeltilmedi.',
          status: 'Çözüldü'
        },
        {
          title: 'WiFi Bağlantı Sorunu',
          description: 'WiFi bağlantısı çok yavaş ve sürekli kopuyor. İş seyahati için uygun değil.',
          status: 'Beklemede'
        },
        {
          title: 'Resepsiyon Hizmeti',
          description: 'Resepsiyon personeli çok ilgisiz ve yardımcı olmuyor. Check-in sırasında uzun süre bekledik.',
          status: 'İnceleniyor'
        }
      ];

      await Complaint.insertMany(sampleComplaints);
      console.log('Örnek şikayetler eklendi');
    }
  } catch (error) {
    console.error('Örnek şikayetler eklenirken hata oluştu:', error);
  }
};

// Örnek şikayetleri ekle
addSampleComplaints();

// Tüm şikayetleri getir
router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Yeni şikayet ekle
router.post('/', async (req, res) => {
  const complaint = new Complaint({
    title: req.body.title,
    description: req.body.description,
    status: 'Beklemede'
  });

  try {
    const newComplaint = await complaint.save();
    res.status(201).json(newComplaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Şikayet durumunu güncelle
router.put('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Şikayet bulunamadı' });
    }

    complaint.status = req.body.status;
    const updatedComplaint = await complaint.save();
    res.json(updatedComplaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Şikayet sil
router.delete('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Şikayet bulunamadı' });
    }

    await complaint.remove();
    res.json({ message: 'Şikayet silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 