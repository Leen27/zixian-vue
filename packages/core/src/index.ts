import { Invoker, type ICommand } from './command'
import { type EngineOptions } from './engine'
export * from './engine'
import { RenderEngine } from 'huajs-render'
class Editor {
  declare invoker: Invoker
  declare renderEngine: RenderEngine
  
  constructor(configs: EngineOptions) {
    this.invoker = new Invoker()
    this.renderEngine = new RenderEngine(configs)
  }

  on(type: string, callback: (...args: any[]) => any) {
    const [engineName, evtName] = type.split(':')
    const engine = {
      'render': this.renderEngine
    }[engineName]
    if(!engine) return

    engine.on(evtName, callback)
  }

  command(commandName: string | ICommand, ...args: any) {
    return this.invoker.execute(commandName, this, ...args)
  }

  undo() {
    this.invoker.undo()
  }
}

export default Editor