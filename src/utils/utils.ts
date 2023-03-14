import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function roomsAvailable(start: string, end: string) {
    const rooms = await prisma.room.findMany({
        select: {
            roomId: true
        }, where: {
            Reservation: {
                none: {
                    AND: {
                        checkIn: {
                            lte: new Date(start).toISOString()
                        },
                        checkOut: {
                            gte: new Date(end).toISOString()
                        }
                    }
                },
                every: {
                    type: { not: "Canceled" }
                }
            }
        }
    }
    )
    return rooms;
}

export function wrapAsync(fn: Function) {
    return function (req: any, res: any, next: any) {
        fn(req, res, next).catch((e: any) => next(e.message))
    }
}