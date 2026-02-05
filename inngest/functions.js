import { asyncThunkCreator } from "@reduxjs/toolkit"
import{inngest} from "./client"

import prisma from "@/lib/prisma"


export const syncUserCreation=inngest.createFunction(
    {id:"sync-user-create"},
    {event:"clerk/user.created"},
    async({event})=>{
        const{data}=event
        await prisma.user.create(
            {
                data:{
                    id:data.id,
                    email:data.email_adresses[0].email.email_adresses,
                    name:`${data.first_name}${data.last_name}`,
                    image:data.image_url

                }
            }
        )
    }
)

export  const syncUserUpdation= inngest.createFunction(
    {id:'sync-user-update'},
    {event:"clerk/user.updated"},
    async({event})=>{
        const {data}=event
        await prisma.user.update({
            where:{id:data.id,},
            data:{
                email:data.email_adresses[o].email_adress,
                nama:`${data.first_name} ${data.last_name}`,
                image:data.image_url
            }
        })
    }
)
export const syncUserDeletion= inngest.createFunction(
    {id:"sync-user-delete"},
    {event:"clerk/user.deleted"},
    async({event})=>{
        const{data}=event
        awaitprisma.user.delete({
            where:{id:data.id,}
           
        })
    }
)