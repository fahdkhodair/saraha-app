

export const asyncHandler = (Fn) => {
    return async (req, res, next) => {
            await Fn(req, res, next).catch(error=>{
                return res.status(500).json({
                    error_message:error.message,
                    error,
                    stack: error.stack
                })
            });
    };
};

export const successResponse =({res,message="Done",status=200,data= {} } = {}) =>{
 return res.status(status).json({message,data})
}

export const globalerrorHandling=(error,req,res,next)=>{
        return res.status(error.cause||400).json({message:error.message,stack:error.stack})
}