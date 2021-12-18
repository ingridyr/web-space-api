const { Router } = require("express")

const router = Router()

router.get('/', (req, res) => {
    return res.send("oi sou a rota 1")
})

module.exports = router