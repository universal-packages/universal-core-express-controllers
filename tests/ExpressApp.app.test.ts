import { ExpressApp as EA } from '@universal-packages/express-controllers'
import { Logger } from '@universal-packages/logger'
import EventEmitter from 'events'

import { ExpressCoreApp } from '../src'

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

describe(ExpressCoreApp, (): void => {
  it('behaves as expected', async (): Promise<void> => {
    const logger = new Logger({ silence: true })
    const module = new ExpressCoreApp({} as any, {} as any, logger)

    await module.prepare()
    await module.run()
    await module.stop()
    await module.release()
  })
})
