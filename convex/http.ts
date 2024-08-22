import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import {internal} from "./_generated/api"
import { WebhookEvent } from "@clerk/nextjs/server";

const validatePayload = async (req: Request): Promise<WebhookEvent | undefined> => {
    const payload = await req.text()

    const svixHeader = {
        "svix-id": req.headers.get("svix-id")!,
        "svix-timestamp": req.headers.get("svix-timestamp")!,
        "svix-signature": req.headers.get("svix-signature")!,
    }

    const webhook = new Webhook(process.env.CLERK_USERS_WEBHOOK || "")

    try {
        const event = webhook.verify(payload, svixHeader) as WebhookEvent
        return event
    } catch (error) {
        console.error('Clerk Webhook not verified');
        
    }
}

const handleClerkWebhook = httpAction(async (ctx, req) => {
    const event = await validatePayload(req);

    if(!event){
        return new Response("could not valid clerk payload", {
            status: 404,
        });
    }

    switch(event.type){
        case "user.created":
            const user = await ctx.runQuery(internal.user.get, {clerkId: event.data.id})
            if(user){
                console.log(`Updating ${event.data.id} with: ${event.data}`);
            }
        case "user.updated":{
            console.log("Creating/Updating User:", event.data.id)

            await ctx.runMutation(internal.user.create, {
                username: `${event.data.first_name} ${event.data.last_name}`,
                imageUrl: event.data.image_url,
                clerkId: event.data.id,
                email: event.data.email_addresses[0].
                email_address,
            });

            break;
        }

        default: {
            console.log("clerk webhook event not supported", event.type);
        }
    }

    return new Response( null, { 
        status: 200
    })

})

const http = httpRouter()

http.route({
    path: "/clerk_users_webhook",
    method: "POST",
    handler: handleClerkWebhook
})

export default http;