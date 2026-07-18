const Coupon = require('../models/Coupon');

// Calcule le montant de la réduction pour un coupon + un sous-total donnés.
// Centralisé ici pour être réutilisé par validateCoupon ET par la création
// de commande (orderController), qui ne doit jamais faire confiance à un
// montant de réduction envoyé par le client.
const computeDiscount = (coupon, subtotal) => {
  if (coupon.discountType === 'percentage') {
    return Math.round((subtotal * coupon.discountValue) / 100);
  }
  return Math.min(coupon.discountValue, subtotal); // jamais plus que le sous-total
};

// Vérifie qu'un coupon est valide pour un sous-total donné.
// Retourne { valid: true, coupon } ou { valid: false, message }.
const checkCouponValidity = async (code, subtotal) => {
  if (!code) return { valid: false, message: 'Code promo requis' };

  const coupon = await Coupon.findOne({ code: code.trim().toUpperCase() });
  if (!coupon) return { valid: false, message: 'Code promo invalide' };
  if (!coupon.isActive) return { valid: false, message: 'Ce code promo n\'est plus actif' };
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return { valid: false, message: 'Ce code promo a expiré' };
  }
  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, message: 'Ce code promo a atteint sa limite d\'utilisation' };
  }
  if (subtotal < coupon.minOrderAmount) {
    return {
      valid: false,
      message: `Montant minimum de ${coupon.minOrderAmount} TND requis pour ce code`,
    };
  }

  return { valid: true, coupon };
};

// @desc    Valider un code promo pour un sous-total donné (utilisé par le panier)
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    const result = await checkCouponValidity(code, Number(subtotal) || 0);

    if (!result.valid) {
      return res.status(400).json({ message: result.message });
    }

    const discountAmount = computeDiscount(result.coupon, Number(subtotal) || 0);
    res.json({
      valid: true,
      code: result.coupon.code,
      discountType: result.coupon.discountType,
      discountValue: result.coupon.discountValue,
      discountAmount,
    });
  } catch (error) {
    console.error('validateCoupon error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Lister tous les coupons (admin)
// @route   GET /api/admin/coupons
// @access  Private/Admin
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ coupons });
  } catch (error) {
    console.error('getAllCoupons error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Créer un coupon (admin)
// @route   POST /api/admin/coupons
// @access  Private/Admin
const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderAmount, usageLimit, expiresAt, isActive } = req.body;

    if (!code || !discountValue) {
      return res.status(400).json({ message: 'Code et valeur de réduction requis' });
    }

    const coupon = await Coupon.create({
      code: code.trim().toUpperCase(),
      discountType: discountType || 'percentage',
      discountValue,
      minOrderAmount: minOrderAmount || 0,
      usageLimit: usageLimit || null,
      expiresAt: expiresAt || null,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({ coupon });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Ce code promo existe déjà' });
    }
    console.error('createCoupon error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Mettre à jour un coupon (admin)
// @route   PUT /api/admin/coupons/:id
// @access  Private/Admin
const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon non trouvé' });

    const fields = ['discountType', 'discountValue', 'minOrderAmount', 'usageLimit', 'expiresAt', 'isActive'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) coupon[f] = req.body[f];
    });
    if (req.body.code) coupon.code = req.body.code.trim().toUpperCase();

    const updated = await coupon.save();
    res.json({ coupon: updated });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Ce code promo existe déjà' });
    }
    console.error('updateCoupon error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Supprimer un coupon (admin)
// @route   DELETE /api/admin/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon non trouvé' });
    res.json({ message: 'Coupon supprimé' });
  } catch (error) {
    console.error('deleteCoupon error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  checkCouponValidity,
  computeDiscount,
  validateCoupon,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};
