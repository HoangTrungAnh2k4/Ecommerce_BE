const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const adminRoutes = require('./adminRoutes');

const auth = require('../middlewares/auth');

const routes = (app) => {
    app.use('/auth/api', authRoutes);
    app.use('/user/api', userRoutes);
    app.use('/admin/api', auth, adminRoutes);
};

module.exports = routes;
