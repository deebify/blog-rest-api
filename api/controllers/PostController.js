/**
 * PostController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  
  
  /**
   * create new post
   * post /post
   * `PostController.create()`
   */
  create: async function (req, res) {

    // Get All Post Data 
    let category = req.param('category'),
      _user = req.param('user_id')
      title = req.param('title'),
      content = req.param('content')

      if( !category || !content || !user_id || !title)
        res.badRequest({err: 'invalid post data'})   

      var cate_item = null
      try{
        // find category if not exist create one 
        cate_item = await Category.findOne({
          name : category
        })
        
        if(!cate_item)
          cate_item = await Category.create({name:category}).fetch()
        
          let post = await Post.create({
          title,
          content,
          _user,
          _category : cate_item.id
        }).fetch()

        res.ok({cate_item,post})
    } catch(err){
      res.serverError(err)
    }
  },

  /**
   * find post by id 
   * /post/:id
   * `PostController.findOne()`
   *  /posts/{id}
   */
  findOne: async function (req, res) {
    let id = req.params.id
    if(!id)
      res.badRequest({err:'invalid post id'})

    let post = await Post.findOne({id}).populate('_category')

    res.ok({post})
  },

  /**
   * finding all post 
   * /posts/
   * `PostController.findAll()`
   */
  findAll: async function (req, res) {
    // /posts/

    let posts = await Post.find().populate('_category')
    
    if(!posts || posts.length === 0)
      throw new Error('No post retrieved!')

    res.ok({posts})
  },

  /**
   * deleteing post by id
   * /posts/:id
   * `PostController.delete()`
   */
  delete: async function (req, res) {
    let id = req.params.id
    if(!id)
      res.badRequest({err:'invaid post id'})
      try {
        let post = await Post.destroy({id}).fetch()
        if(!post || post.length === 0)
          res.ok(`No Record with ID: ${id} in our databases`)  
        res.ok(`ID: ${post.id} Post: ${post.title} has been deleted`)
      } catch (err) {
        res.serverError(err)
      }
  },

  /**
   * updating post by id
   * `PostController.update()`
   */
  update : async function (req, res) {
    let id = req.params.id,
      _user = req.param('user_id')
      title = req.param('title'),
      content = req.param('content')
    
    let post = {}
    if(_user)
      post._user = _user
    if(title)
      post.title = title
    if(content)
      post.content = content
    
    try {
      let up_post = await Post.update({id}).set(post).fetch()
      res.ok(up_post)
    } catch (err) {
      throw new Error('Error while updating')
    }

  },


  /**
   * `PostController.create using async serials`
   */
  createasync: async function (req, res) {
    // updating the Post Comming!
    let category = req.param('category'),
    _user = req.param('user_id')
    title = req.param('title'),
    content = req.param('content')

    if( !category || !content || !_user || !title)
      res.badRequest({err: 'invalid post data'})
    
    var cate_item
    async.series([
      async cb => {
        try{
          cate_item = await Category.findOne({name:category})
          if(!cate_item)
            cate_item = await Category.create({name:category}).fetch();
          cb(null,cate_item)
        }catch(err){
          cb(err)
        }
      },
      async cb => {
        try {
          post = await Post.create({
            title,
            content,
            _user,
            _category:cate_item.id
          }).fetch()
          cb(null,post)
        } catch (err) {
          cb(err)
        }
      }
    ],(err,results)=>{
      if(err)
        res.serverError(err)

      res.ok(results)
    })
  }

};

