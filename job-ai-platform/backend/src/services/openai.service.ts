import { env } from "../config/env";

export class OpenAIService {
  getClientConfig() {
    return {
      apiKeyAvailable: Boolean(env.OPENAI_API_KEY)
    };
  }
}

export const openAIService = new OpenAIService();

