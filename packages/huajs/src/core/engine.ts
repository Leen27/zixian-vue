import { createApp, type App } from 'vue';
import GraphView from './GraphView.vue'
import VueKonva from 'vue-konva';
import { Invoker, type ICommand } from '../command';
import { createEventBus, type EventBus } from '../eventBus'

export type EngineOptions = {
  id: string
}

export class Engine {
  declare invoker: Invoker
  declare eventBus: EventBus

  constructor() {
    this.invoker = new Invoker()
    this.eventBus = createEventBus()
  }

  command(commandName: string | ICommand, ...args: any) {
    return this.invoker.execute(commandName, this, ...args)
  }

  undo() {
    return this.invoker.undo()
  }

  on(eventName: string, callback: (...args: any) => any ): EventBus {
    this.eventBus.on(eventName, callback)
    return this.eventBus
  }

  off(eventName: string, callback: (...args: any) => any) {
    return this.eventBus.off(eventName, callback)
  }
}

export class RenderEngine extends Engine {
  declare _vue_app: App

  constructor(options: EngineOptions) {
    super()

    const { id } = options

    this._vue_app = this.initApp(id)
  }

  initApp(id: string) {
    const app = createApp(GraphView);
    app.use(VueKonva);
    app.mount(`#${id}`);

    return app
  }
}