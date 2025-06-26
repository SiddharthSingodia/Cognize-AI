import supabase from "../services/superbase";
import { inngest } from "./client";


export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);
 
export const llmModel= inngest.createFunction(
 { id:"llm-model"},
 { event:"llm-model"},
  async({event,step})=>{
    const aiResp = await step.ai.infer('generate-ai-llm-model-call', {
      model: step.ai.models.gemini({
        model: 'gemini-1.5-flash',
        apiKey: process.env.GEMINI_API_KEY
      }),
      // the body written here is as per the need of gemini api , if use diff. llm then it may be different
      body: { 
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Depends on user input sources, Summerize and search about the topic, Give me markdown text with proper formatting. User Input is: ${event.data.searchInput}. \n\nHere are the search results to summarize:\n ${JSON.stringify(event.data.searchResult)}`
              }
            ]
          }
        ]
      }
    })

    const saveToDb=await step.run('saveToDb', async()=>{
      const {data, error} = await supabase
      .from('Chats')
      .update({ aiResp: aiResp?.candidates[0].content.parts[0].text})
      .eq('id', event.data.recordId)
      .select()

      return aiResp
      
    })
    

  }
)