import imagekit from "@/app/config/imageKit";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

export async function POST(request){
    try {
        const {userId}=getAuth(request)
        const formData= await request.formData()
        const name= formData.get("name")
        const username= formData.get("username")
        const description= formData.get("description")
        const email= formData.get("email")
        const contact= formData.get("contact")
        const address= formData.get("address")
        const image= formData.get("image")
        if(!name ||!username||!description|| !email || contact ||!address|| !image){
            return NextResponse.json({error:"missing  store info"}, {status:400})
        }
       // validating  the store is registered  or not
       const store =await prisma.store.findFirst({
        where :{ userId:userId}
       })
       //if the store  is already rigistered  then it send  the  status of store 
       if (store){
        return NextResponse.json({status:store.status})

       }
       const isUnameTaken =await prisma.store.findFirst({
        where :{username:username.toLowerCase()}

       })
       if(isUnameTaken){
        return NextResponse.json({error :"the user name is already taken" },{status:400})
       }
       // image upload
       const buffer =Buffer.from(await image.arrayBuffer());
       const response=await imagekit.upload({
        file:buffer,
        fileName:image.name,
        folder:logos
       })
       const optimizedImage=imagekit.url({
        path:response.filepath,
        transformation:[
            { quality:'auto' },
            { format:'webp' },
            { width: '512' }
        ]
       })
       const newStore = await prisma.store.create({
        data: {
            userId,
            name,
            description,
            email, 
            contact,
            address,
            logo: optimizedImage
        }
       })
        
       await prisma.user.update({
        where:{id:userId},
        data:{
            store:{connect:({id:newStore.id})}

        }
       })
       return NextResponse.json({massage:"applied ,waiting for  approval"})
    } catch (error) {
        console.error(error)
        return NextResponse.json({error:error.code|| error.message},{status:400})
        
    }
}
export async function GET(request) {
    try {
        const{userId}=getAuth(request)
        const store =await prisma.store.findFirst({ where:{userId:userId}})
        
        if(store){
            return NextResponse.json({status:store.status})
        }
        return NextResponse.json({status:"not registered"})
    } catch (error) {
        console.error(error)
        return NextResponse.json({error:error.code|| error.message},{status:400})
        
    }
    
}