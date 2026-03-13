import { clientEnv } from "./env";
import { getSession } from "next-auth/react";

export class ApiClientError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

class ApiClient {
  private readonly baseUrl = clientEnv.apiBaseUrl;

  private async getAuthorizationHeader() {
    const session = await getSession();
    const backendAccessToken = session?.backendAccessToken;

    if (!backendAccessToken) {
      return {};
    }

    return {
      Authorization: `Bearer ${backendAccessToken}`
    };
  }

  async get<TResponse>(path: string): Promise<TResponse> {
    const authHeader = await this.getAuthorizationHeader();
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...authHeader
      }
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = typeof payload.error === "string" ? payload.error : "Request failed";
      throw new ApiClientError(message, response.status);
    }

    return payload as TResponse;
  }
}

export const apiClient = new ApiClient();
