export const auth =(req,res,next)=>{
    if(req.session?.user==="admin" && req.session?.admin){
        return next()
    }else{
        return res.status(400).send('error de autorizacion!')
    }
}