import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const authCheck = async (req, res, next) => {
  // const authHeader = req.headers["authorization"];
  // const token = authHeader && authHeader.split(" ")[1];
  // if (token == null) return res.status(401).json({ message: "Unauthorized" });
  // jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
  //   if (err || user.role != "admin") {
  //     return res.status(403).json({ message: "Forbidden" });
  //   }
  //   req.user = user.email;
  //   next();
  // });

  if(req.session && req.session.refreshToken){
    const refreshToken = req.session.refreshToken;
    const user = await userModel.findAll({
      where:{
        refreshToken: refreshToken
      }
    });
     if(!user[0]){
    // req.flash('error', 'Unauthorized');
    // res.redirect('/');
    res.status(403).json({status:false, message:"Unauthorized"});
    }
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
      if (err) {
        // req.flash('error', 'Invalid refresh token');
        // res.redirect('/');
        res.status(400).json({status:false, message:"Invalid refresh token"});
      }
      next();
    })
  }else{
    // req.flash('error', 'Forbidden. Have to login first');
    // res.redirect('/');
    res.status(403).json({status:false, message:"Forbidden. Have to login first"});
  }
};

