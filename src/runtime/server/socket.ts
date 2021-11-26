import type { IncomingMessage } from 'http'
import * as WebSocket from 'ws'

let wss: WebSocket.Server

/**
 * WebSocket server useful for live content reload.
 */
export function useWebSocket() {
  if (!wss) wss = new WebSocket.Server({ noServer: true })

  const serve = (req: IncomingMessage, socket = req.socket, head: any = '') =>
    wss.handleUpgrade(req, socket, head, (client: any) => wss.emit('connection', client, req))

  const broadcast = (data: any) => {
    data = JSON.stringify(data)

    for (const client of wss.clients) {
      try {
        client.send(data)
      } catch (err) {
        /* Ignore error (if client not ready to receive event) */
      }
    }
  }

  return {
    serve,
    broadcast
  }
}
