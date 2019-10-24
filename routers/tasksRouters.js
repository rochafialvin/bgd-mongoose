const express = require('express')
const router = express.Router()

const Task = require('../models/taskModel')
const User = require('../models/userModel')

// CREATE TASK
router.post('/tasks/:userid', async (req, res) => {

    try {
        let user = await User.findById(req.params.userid)
        let task = new Task({
            ...req.body,
            owner: user._id
        })

        // task = {_id, description, completed}

        // Simpan id task yang baru ke array tasks pada user
        user.tasks.push(task._id)

        // Simpan user dan task ke database
        await user.save()
        await task.save()

        res.send(task)

    } catch (error) {
        res.send(error)

    }
    
})

// READ ALL OWN TASKS
router.get('/tasks/:userid', async (req, res) => {

    try {
        // user = {_id, name, ... , tasks}
        let resp = await User.find({_id: req.params.userid}).populate({path: 'tasks'}).exec()

        res.send(resp[0].tasks)

    } catch (error) {

        res.send(error)
    }

})

// UPDATE TASK
router.patch('/tasks/:taskid', async (req, res) => {
    let updates = Object.keys(req.body)
    let allowedUpdates = ['description', 'completed']
    let result = updates.every(update => allowedUpdates.includes(update))

    if(!result){
        res.send({err: "Invalid Request"})
    }

    try {
        let task = await Task.findById(req.params.taskid)
        updates.forEach(update => { task[update] = req.body[update] })

        await task.save()

        res.send(task)
    } catch (error) {
        res.send(error)
    }

})


// DELETE TASK
router.delete('/tasks/:taskid', async (req, res) => {

    try {
        // Delete task
        let task = await Task.findByIdAndDelete(req.params.taskid)
        // task = {_id, description, completed, owner}

        // Delete deletedTask id, menghapus id task yang sudah di hapus di collection tasks
        let user = await User.findById(task.owner)
        // Mencari posisi index dari task yang sudah di hapus
        let index = user.tasks.indexOf(req.params.taskid)
        // Hapus _id task berdasarkan index
        user.tasks.splice(index,1)
        // Simpan perubahan user (Karena data pada tasks berubah / terhapus)
        await user.save()
        // Kirim respon berupa object dengan property berisi task yang berhasil di hapus
        res.send({deletedTask : task})
        
    } catch (error) {
        res.send(error)
    }

})

module.exports = router