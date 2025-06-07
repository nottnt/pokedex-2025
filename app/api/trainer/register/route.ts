import { connectToDB } from "@/lib/mongodb";
import { Trainer } from "@/lib/models/Trainer";
import { TrainerFormData, trainerSchema } from "@/lib/validation/trainer";

export async function POST(req: Request) {
  try {
    const body: TrainerFormData = await req.json();
    const data = trainerSchema.parse(body);
    await connectToDB();
    const newTrainer = await Trainer.create(data);
    return Response.json({ success: true, trainer: newTrainer });
  } catch (err: any) {
    return Response.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}
