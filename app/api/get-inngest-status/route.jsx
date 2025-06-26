import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { runId } = await req.json();
        const result = await axios.get(
            process.env.INNGEST_SERVER_HOST + '/v1/events/' + runId + '/runs',
            {
                headers: {
                    Authorization: `Bearer ${process.env.INNGEST_API_KEY}`,
                }
            }
        );
        return NextResponse.json(result.data);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
