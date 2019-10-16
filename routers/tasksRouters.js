const express = require('express')
const router = express.Router()

const Task = require('../models/taskModel')

// CREATE TASK
router.post('/tasks', async (req, res) => {

    try {
        let task = new Task(req.body)
        let resp = await task.save()
        res.send(resp)

    } catch (error) {
        res.send(error.message)

    }
    
})

// UPDATE TASK
router.patch('/tasks/:taskid', async (req, res) => {
    try {
        // Cari task berdasarkan id
        let task = await Task.findById(req.params.taskid)
        // task = {description, completed}
        // Update completed menjadi true
        task.completed = true
        // Simpan task yang sudah di update
        await task.save()
        // Kirim respon
        res.send({updatedTask : task})

    } catch (error) {
        res.send(error)
    }

})


// DELETE TASK
router.delete('/tasks/:taskid', async (req, res) => {

    try {
        let task = await Task.findByIdAndDelete(req.params.taskid)
        res.send({deletedTask : task})
        
    } catch (error) {
        res.send(error)
    }

})

module.exports = router