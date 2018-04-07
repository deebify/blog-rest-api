/**
 * PostController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
  
  /**
   * `PostController.create()`
   */
  create: async function (req, res) {

    // Get All Post Data 
    let category = req.param('category'),
      user_id = req.param('user_id')
      title = req.param('title'),
      content = req.param('content')

      if( !category || !content || !user_id || !title)
        res.badRequest({err: 'invalid post data'})   
             
      try{
        category = await Category.create({name:category}).fetch()
        let post = await Post.create({
          title,
          content,
          _user : user_id,
          _category : category.id
        }).fetch()

        res.ok({category,post})
    } catch(err){
      res.serverError(err)
    }
  },

  /**
   * `PostController.findOne()`
   */
  findOne: async function (req, res) {
    return res.json({
      todo: 'findOne() is not implemented yet!'
    });
  },

  /**
   * `PostController.findAll()`
   */
  findAll: async function (req, res) {
    let cateories = await Category.findAll()
    return res.json({
      list: cateories
    });
  },

  /**
   * `PostController.update()`
   */
  update: async function (req, res) {
    return res.json({
      todo: 'update() is not implemented yet!'
    });
  },

  /**
   * `PostController.delete()`
   */
  delete: async function (req, res) {
    return res.json({
      todo: 'delete() is not implemented yet!'
    });
  }

};

