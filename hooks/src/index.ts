import express, { type Request, type Response } from "express"
import { prisma } from "./lib/prisma.js"
const app = express();
app.use(express.json());

app.post("/hooks/catch/:userId/:zapId/", async (req: Request, res: Response)=> {
    console.log("hii there")
    const zapId : any = req.params.zapId;
    const userId = req.params.userId;
    const body: any = req.body;
    try{
        await prisma.$transaction(async tx => {
            console.log(JSON.stringify(body));
            const run = await tx.zapRun.create({
                data: {
                    zapId: zapId,
                    metadata: body
                }
            })
            
            await tx.zapRunOutbox.create({
                data : {
                    zapRunId: run.id
                }
            })
        })
        res.status(200).json({
            msg: "webhook received"
        })
    } catch(e){
        res.status(500).json({
            msg: "something went wrong"
        })
    }
})

app.post("/user", async (req: Request, res: Response) => {
        await prisma.user.create({
            data: {
                email: "kumar@gmail.com",
                name: "kumar",
                password: "kumar"
            }
        })
        return res.json({
            msg: "user created successfully"
        })
})

app.listen(8080, ()=>{
    console.log("app is listening on port 8080");
});