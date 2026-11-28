import { Server as EAServer } from "engine.io";
import type { WebSocket } from "ws";
import { Server as SocketIOServer } from "socket.io";
import type { ExchangePeer } from "../utils/Exchange";

/**
 * Nitro-плагин: Socket.io-сервер для потока тикеров Bybit.
 *
 * Socket.io работает поверх engine.io, который здесь подключается вручную:
 * - HTTP-запросы (polling) обрабатываются в `handler` через `engine.handleRequest`;
 * - WebSocket upgrade обрабатывается в `websocket.open` (crossws), и сокет
 *   передаётся в engine.io напрямую через `engine.onWebSocket`.
 *
 * Эндпоинт: `/bybit/socket.io/`
 *
 * События клиент → сервер:
 * - `subscribe` `{ symbol: string }`: подписаться на тикер символа;
 * - `unsubscribe` `{ symbol: string }`: отписаться от тикера символа.
 *
 * События сервер → клиент:
 * - `ticker`: данные тикера (`msg.data`);
 * - `error`: сообщение об ошибке (`msg.message`).
 *
 * При отключении клиента его подписки снимаются через `bybit.removePeer`.
 *
 * Требует `nitro.experimental.websocket: true` в `nuxt.config.ts`.
 *
 * @remarks
 * Используются внутренние API, которые не покрыты типами и могут измениться
 * при обновлении зависимостей:
 * - `peer._internal` в crossws;
 * - `engine.prepare` и `engine.onWebSocket` в engine.io (объявлены как private).
 *
 * При обновлении `nitropack`, `crossws` или `engine.io` проверьте, что
 * WebSocket upgrade по-прежнему работает.
 */
export default defineNitroPlugin(() => {
	const nitroApp = useNitroApp();
	const engine = new EAServer();
	const io = new SocketIOServer();

	io.bind(engine);

	const bybit = new Bybit();

	io.on("connection", (socket) => {
		/**
		 * Адаптер соединения для Bybit-клиента: принимает JSON-строку
		 * `{ type, data | message }` и пробрасывает её в Socket.io-сокет
		 * как событие `ticker` или `error`.
		 */
		const peer: ExchangePeer = {
			send: (payload: string) => {
				try {
					const msg = JSON.parse(payload);
					switch (msg.type) {
						case "ticker":
							socket.emit("ticker", msg.data);
							break;
						case "kline":
							socket.emit("kline", msg.data);
							break;
						case "error":
							socket.emit("error", msg.message);
							break;
					}
				} catch (err) {
					console.error(err);
				}
			},
		};

		socket.on("subscribe", ({ symbol, interval }: { symbol: string; interval?: string }) => {
			bybit.subscribe(peer, symbol, interval);
		});

		socket.on("unsubscribe", ({ symbol, interval }: { symbol: string; interval?: string }) => {
			bybit.unsubscribe(peer, symbol, interval);
		});

		socket.on("disconnect", () => {
			bybit.removePeer(peer);
		});
	});

	nitroApp.hooks.hook("close", () => io.close());

	nitroApp.router.use(
		"/bybit/socket.io/",
		defineEventHandler({
			handler(event) {
				engine.handleRequest(event.node.req, event.node.res);
			},
			websocket: {
				/**
				 * WebSocket upgrade: достаёт нативные `req` и `ws` из crossws-peer
				 * и передаёт их в engine.io. При ошибке закрывает соединение.
				 */
				open(peer) {
					// @ts-expect-error - internal field
					const nodeReq: IncomingMessage = peer._internal.nodeReq;
					// @ts-expect-error - internal field
					const ws: WebSocket = peer._internal.ws;

					// в unenv-окружении настоящий req лежит в __unenv__._req, в Node nodeReq уже настоящий
					// @ts-expect-error - internal field
					const req: IncomingMessage = nodeReq.__unenv__?._req ?? nodeReq;

					try {
						// @ts-expect-error prepare в engine.io объявлен как private
						engine.prepare(req);
						// @ts-expect-error onWebSocket в engine.io объявлен как private
						engine.onWebSocket(req, req.socket, ws);
					} catch (err) {
						console.error(err);
						peer.close();
					}
				},
			},
		})
	);
});
