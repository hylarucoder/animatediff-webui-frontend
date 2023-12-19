// wrap $fetch post / get .... and message error

import { API_URL, MEDIA_URL } from "@/consts"

async function nfetch(resource: string, options = {}) {
  const { timeout = 5000 } = options

  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  })
  clearTimeout(id)

  return response
}

class ApiClient {
  async get(path: string, params?: any) {
    const res = await nfetch(API_URL + path, {
      method: "GET",
    })
    if (res.status >= 400 && res.status < 500) {
      throw new Error("Bad request")
    } else if (res.status >= 500) {
      throw new Error("Internal server error")
    }
    return res.json()
  }

  async post(path: string, data?: any, params?: any) {
    const res = await nfetch(API_URL + path, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (res.status === 400) {
      const a = await res.json()
      throw new Error(a.message)
    }
    if (res.status >= 400 && res.status < 500) {
      throw new Error("Bad request")
    } else if (res.status >= 500) {
      throw new Error("Internal server error")
    }
    return res.json()
  }
}

const client = new ApiClient()

export const formatProxyMedia = (path: string) => {
  return MEDIA_URL + "?path=" + path
}

export const getOptions = async (): Promise<any> => {
  return await client.get("/options")
}

export const submitTask = async (data: any): Promise<any> => {
  return await client.post("/pipeline/submit", data)
}

export const getTaskStatus = async (data: any): Promise<any> => {
  return await client.post("/pipeline/status", data)
}

export const interruptTask = async (): Promise<any> => {
  return await client.post("/pipeline/interrupt")
}
