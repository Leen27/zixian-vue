import { Engine } from 'huajs-common'
import { useRepo, type Repository, type Item, Model } from 'pinia-orm'
import type Editor from '../index'
/**
 * The Command interface declares a method for executing a command.
 */
export interface ICommand {
  execute(): Promise<any>
  undo(): Promise<any>
}

export interface ICommandWithConsturctor {
  new(...args: any): ICommand
}

export class AddShapeCommand<T extends Model> implements ICommand {
  render: Engine
  declare shape: T | T[]
  repo: ReturnType<typeof useRepo>

  constructor(eidtor: Editor, repo: ReturnType<typeof useRepo>, shape: T | T[]) {
    this.render = eidtor.renderEngine
    this.shape =shape 
    this.repo = repo
  }

  public async execute() {
    this.repo.save(this.shape)

    return Promise.resolve()
  }

  public async undo() {
    const destroyArr = Array.isArray(this.shape) ? this.shape.map(sp => sp.id).filter(sp => !!sp) : [this.shape.id]
    this.repo.destroy(destroyArr)
    
    return Promise.resolve()
  }
}

export class ChangePositionCommand<T extends Model> implements ICommand {
  render: Engine
  declare newPosition: Item<T>
  declare oldPosition: Item<T> | null
  repo: Repository<T>

  constructor(eidtor: Editor, repo: Repository<T>, newPosition: Item<T>) {
    this.render = eidtor.renderEngine
    this.newPosition = newPosition 
    this.oldPosition = null
    this.repo = repo
  }

  public async execute() {
    this.repo.save({
      ...this.newPosition
    })
    return Promise.resolve()
  }

  public async undo() {
    this.repo.save({
      ...this.oldPosition
    })
    return Promise.resolve()
  }
}


