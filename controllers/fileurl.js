const FileURL = require('../models/fileUrl');

exports.dowloadedFiles = async (req,res,next) =>{
    debugger;
    const userId = req.user.id;
    FileURL.find({_id : userId})
    .then((result) =>{
        res.status(200).json(result);
    })
    .catch((err) =>{
        res.status(500).json({message : err});
    })
}