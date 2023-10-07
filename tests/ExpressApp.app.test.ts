import { ExpressApp as EA } from '@universal-packages/express-controllers'
import { Logger } from '@universal-packages/logger'
import EventEmitter from 'events'

import { ExpressCoreApp } from '../src'

class ClassMock extends EventEmitter {
  public prepare() {
    this.emit('request/start', { payload: { request: {} }, measurement: '' })
    this.emit('request/not-found', { payload: { request: {}, response: { statusCode: 1 } }, measurement: '' })
    this.emit('request/error', { payload: { request: {}, response: { statusCode: 1 } }, measurement: '' })
    this.emit('request/middleware', { payload: { request: {} }, measurement: '' })
    this.emit('request/handler', { payload: { request: {} }, measurement: '' })
    this.emit('request/end', { payload: { request: { params: { 1: 1 }, query: { 2: 2 }, body: { 3: 3 } }, response: { statusCode: 1 } }, measurement: '' })
    this.emit('warning', { message: 'warning' })
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
