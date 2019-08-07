const express = require('express');

// database access using knex
const db = require('../data/db-config.js');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const posts = await db('posts');
        // const posts = await db.select('*').from('posts');
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({message:'error getting posts', error:err});
    }


});


router.get('/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const [post] = await db.select('*').from('posts').where('id', '=', id); // SELECT * FROM 'posts' WHERE id = {id}
        //const [post] = await db('posts').where({id});
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({message: `could not find post with id ${id}`});
        } 
    } catch (err) {
        res.status(500).json({message:'failed to get post', error: err});
    }
});

router.post('/', async (req, res) => {
    const postData = req.body;

    try {
        const post = await db('posts').insert(postData);
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({message: 'could not add your post'});
    }

});

router.put('/:id', async (req, res) => {
    const {id} = req.params;
    const changes = req.body;

    try {
        const count = await db('posts').where('id', '=', id).update(changes);
        // const count = await db('posts').where({id}).update(changes);
        if (count) {
            res.status(200).json({updated: count});
        } else {
            res.status(404).json({message: `could not find post #${id}`});
        }
    } catch (err) {
        res.status(500).json({message:'could not update the post', error: err});
    }

});

router.delete('/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const count = await db('posts').where({id}).del();
        if (count) {
            res.status(200).json({deleted: count});
        } else {
            res.status(404).json({message: `could not find post #${id}`});
        }
    } catch (err) {
        res.status(500).json({message: 'could not delete the post... dunno why really.', error: err});
    }
});

module.exports = router;