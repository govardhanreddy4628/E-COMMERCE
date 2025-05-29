// const asyncHandler = (requestHandler) => {
//     (req, res, next) => {
//         Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
//     }
// }

import {Request, Response, NextFunction } from "express"

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => async (req:Request, res:Response, next:NextFunction) => {
    try {
        await fn(req, res, next)
    } catch (error: any) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        })
    }
}

export {asyncHandler}