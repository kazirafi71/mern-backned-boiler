const router = require('express').Router()
const {
    login,
    register
} = require('../controllers/userController')
const {
    requireLogin
} = require('../middlewares/requireLogin')




router.post('/register', register)
router.post('/login', login)
router.get('/xyz', requireLogin, (req, res) => {
    res.send('sdfsd')
})


module.exports = router