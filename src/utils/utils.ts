export function wrapAsync(fn: Function) {
    return function (req: any, res: any, next: any) {
        fn(req, res, next).catch((e: any) => next(e.message))
    }
}