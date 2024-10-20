import userModel from "../../models/userModel.js";

export const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.session.refreshToken;
    if(!refreshToken){
      return res.status(401).json({status: false, message: "Unauthorized"});
    }
    const user = await userModel.findAll({
      where:{
        refreshToken: refreshToken
      }
    })
    if(!user[0]){
      req.flash('error', 'Unauthorized');
      res.redirect('/');
      // return res.status(401).json({status: false, message: "Unauthorized"});

    }
    const userId = user[0].id;
    await userModel.update({refreshToken:null},{
      where:{
        id: userId
      }
    })
    req.session.destroy(function(err) {
      if (err) {
        console.error('Session destruction error:', err);
      }
      res.clearCookie('connect.sid');
      res.redirect('/');
      // return res.status(200).json({status: true, message: "Success logout"});
    });
  }catch(error){
    console.log(error.message)
    req.flash('error', error.message);
    res.redirect('/cars');
    // return res.status(500).json({status: false, message: error.message});
  }
};
