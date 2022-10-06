import { Logger } from '@universal-packages/logger'
import { ExpressApp as EA } from '@universal-packages/express-controllers'
import EventEmitter from 'events'

import ExpressApp from '../src/ExpressApp.universal-core-app'

class ClassMock extends EventEmitter {
  public prepare() {
    this.emit('request/start', { request: {}, measurement: '' })
    this.emit('request/not-found', { request: {}, response: { statusCode: 1 }, measurement: '' })
    this.emit('request/error', { request: {}, response: { statusCode: 1 }, measurement: '' })
    this.emit('request/middleware', { request: {}, measurement: '' })
    this.emit('request/handler', { request: {}, measurement: '' })
    this.emit('request/end', { request: { params: { 1: 1 }, query: { 2: 2 }, body: { 3: 3 } }, response: { statusCode: 1 }, measurement: '' })
  }
  public run = jest.fn()
  public stop = jest.fn()
  public release = jest.fn()
}

jest.mock('@universal-packages/express-controllers')
const ExpressAppMock = EA as unknown as jest.Mock
ExpressAppMock.mockImplementation((): ClassMock => new ClassMock())

describe('ExpressApp', (): void => {
  it('behaves as expected', async (): Promise<void> => {
    const logger = new Logger({ silence: true })
    const module = new ExpressApp({} as any, {} as any, logger)

    await module.prepare()
    await module.run()
    await module.stop()
    await module.release()
  })
})
