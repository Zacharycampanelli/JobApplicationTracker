import { prisma } from "../lib/prisma"

export const createUser = async (email: string, password: string) => {
    
return prisma.user.create({
    data: {
        email,
        password,
    },
});
}