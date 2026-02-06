
import { inngest } from "./client";
import prisma from "@/lib/prisma";

export const syncUserCreation = inngest.createFunction(
    { id: "sync-user-create" },
    { event: "clerk/user.created" },
    async ({ event }) => {
        try {
            const { data } = event;
            await prisma.user.create({
                data: {
                    id: data.id,
                    email: data.email_addresses?.[0]?.email_address || "",
                    name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
                    image: data.image_url || "",
                },
            });
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    }
);

export const syncUserUpdation = inngest.createFunction(
    { id: "sync-user-update" },
    { event: "clerk/user.updated" },
    async ({ event }) => {
        try {
            const { data } = event;
            await prisma.user.update({
                where: { id: data.id },
                data: {
                    email: data.email_addresses?.[0]?.email_address || "",
                    name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
                    image: data.image_url || "",
                },
            });
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    }
);
export const syncUserDeletion = inngest.createFunction(
    { id: "sync-user-delete" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        try {
            const { data } = event;
            await prisma.user.delete({
                where: { id: data.id },
            });
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
    }
);