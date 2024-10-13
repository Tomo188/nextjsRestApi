export function loggingMiddleware(req: Request){
    return{
        response:`${req.method} ${req.url}`
    }
}
