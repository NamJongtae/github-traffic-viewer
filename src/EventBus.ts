type EventCallback = (...args: any[]) => void;

export class EventBus<T extends Record<string, EventCallback>> {
  private events: Partial<Record<keyof T, T[keyof T][]>> = {};

  // 이벤트 구독
  subscribe<K extends keyof T>(event: K, callback: T[K]) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    (this.events[event] as T[K][]).push(callback);
  }

  // 이벤트 발행
  publish<K extends keyof T>(event: K, ...args: Parameters<T[K]>) {
    if (this.events[event]) {
      this.events[event]!.forEach((callback) => callback(...args));
    }
  }
}
