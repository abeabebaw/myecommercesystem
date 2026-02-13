import imagekit from "@/app/config/imageKit";
import authSeller from "@/app/middlewares/authSeller";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request){
    try {
        
        const{userId}= getAuth(request)
        const storeId=await authSeller(userId)
        if(!storeId){
            return NextResponse.json({error:'not authorized'},{status:401})
        }
        const fromData=await request.formData()
        const name=fromData.get("name")
        const description=fromData.get("description")
        const mrp=Number(fromData.get("mrp"))
        const price=Number(fromData.get("price"))
        const category=fromData.get("category")
        const images=fromData.getAll("images")
        if(!name||!description||!mrp||!price||!category||!images.length <1){
            return  NextResponse.json({error:"product is not added to the sysystem"},{ status:400})
        }
        // uploading images in  the imagekit
        const imageUrl=await Promise.all(images.map(async(image)=>{
            const buffer=Buffer.from(await image.arrayBuffer())
            const response= await imagekit.upload({
                file:buffer,
                filename:image.name,
                folder:"products"

            })
            const url=imagekit.url({
                path:response.filepath,
                transformation:[
                    {quality:'auto'},
                    {format:'webp'},
                    {width:'1024'}
                ]
            })
            return url
        }))
        await prisma.product.create({
            data:{
                name,
                description,
                mrp,
                price,
                category,
                images:imageUrl,
                storeId

            }


        })
        return NextResponse.json({massage:"product add successfully"})

    } catch (error) {
        console.error(error)
        return NextResponse.json({error:error.code|| error.massage},{status:400})
        
    }

}
//get all products for a seller 
export async function GET(request){
    try {
     const {userId}=getAuth(request)
     const storeId=await authSeller(userId)
     if(!storeId){
        return NextResponse.json({error:'not authorized  '},{status:400})}
    } 
    catch (error) {
          console.error(error)
        return NextResponse.json({error:error.code|| error.massage},{status:401})
    }
}