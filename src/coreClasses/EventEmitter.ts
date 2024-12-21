export type Listener<T> = (data: T) => void;

export class EventEmitter<Events extends Record<string, any>> {
  private events: Map<keyof Events, Set<Listener<any>>> = new Map();

  on<K extends keyof Events>(event: K, listener: Listener<Events[K]>) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(listener);
  }

  off<K extends keyof Events>(event: K, listener: Listener<Events[K]>) {
    this.events.get(event)?.delete(listener);
  }

  emit<K extends keyof Events>(event: K, data: Events[K]) {
    this.events.get(event)?.forEach((listener) => listener(data));
  }

  clear() {
    this.events.clear();
  }
}
