import { CoreApp } from '@universal-packages/core'
import { ExpressControllers, ExpressControllersOptions } from '@universal-packages/express-controllers'
import { Request, Response } from 'express'

import { LOG_CONFIGURATION } from './LOG_CONFIGURATION'
import { setRequestHandled, setRequestHandling, updatePresenterDoc } from './updatePresenterDoc'

export default class ExpressControllersApp extends CoreApp<ExpressControllersOptions> {
  public static readonly appName = 'express-controllers'
  public static readonly description = 'Express Controllers Core App'
  public static readonly defaultConfig: ExpressControllersOptions = { appLocation: './src' }

  public expressControllers: ExpressControllers

  public async prepare(): Promise<void> {
    this.expressControllers = new ExpressControllers({ ...this.config, port: this.args.port || this.args.p || this.config.port })

    this.expressControllers.on('request:start', (event): void => {
      this.logger.log(
        {
          level: 'DEBUG',
          title: 'Incoming request',
          metadata: this.getMetadata(event),
          category: 'EXPRESS'
        },
        LOG_CONFIGURATION
      )
    })

    this.expressControllers.on('request:not-found', (event): void => {
      this.logger.log(
        {
          level: 'WARNING',
          title: 'No handler configured for the route',
          metadata: this.getMetadata(event),
          measurement: event.measurement.toString(),
          category: 'EXPRESS'
        },
        LOG_CONFIGURATION
      )
    })

    this.expressControllers.on('request:error', (event): void => {
      this.logger.log(
        {
          level: 'ERROR',
          title: 'There was an error while handling the request',
          error: event.error,
          metadata: this.getMetadata(event),
          measurement: event.measurement.toString(),
          category: 'EXPRESS'
        },
        LOG_CONFIGURATION
      )
    })

    this.expressControllers.on('request:middleware', (event): void => {
      this.logger.log(
        {
          level: 'DEBUG',
          title: `Using middleware ${event.payload.name}`,
          metadata: this.getMetadata(event),
          category: 'EXPRESS'
        },
        LOG_CONFIGURATION
      )
    })

    this.expressControllers.on('request:handler', (event): void => {
      this.logger.log(
        {
          level: 'QUERY',
          title: 'Handling request',
          metadata: this.getMetadata(event),
          category: 'EXPRESS'
        },
        LOG_CONFIGURATION
      )

      setRequestHandling(event.payload.handler)
    })

    this.expressControllers.on('request:end', (event): void => {
      this.logger.log(
        {
          level: 'INFO',
          title: 'Request handled',
          metadata: this.getMetadata(event),
          measurement: event.measurement.toString(),
          category: 'EXPRESS'
        },
        LOG_CONFIGURATION
      )

      setRequestHandled(event.payload.handler, event.measurement)
    })

    this.expressControllers.on('warning', (event): void => {
      this.logger.log(
        {
          level: 'WARNING',
          message: event.message,
          metadata: this.getMetadata(event),
          category: 'EXPRESS'
        },
        LOG_CONFIGURATION
      )
    })

    await this.expressControllers.prepare()

    this.setTerminalPresenter()
  }

  public async run(): Promise<void> {
    await this.expressControllers.run()
  }

  public async stop(): Promise<void> {
    await this.expressControllers.stop()
  }

  private getRequestResponseMetadata(request: Request, response: Response): any {
    const hasParams = Object.keys(request?.params || {}).length > 0
    const hasQuery = Object.keys(request?.query || {}).length > 0
    const hasBody = !!request?.body
    const metadata: any = {}

    if (hasParams) metadata.params = request.params
    if (hasQuery) metadata.query = request.query
    if (hasBody) metadata.body = request.body
    metadata.route = `${request?.method} ${request?.path}`
    if (response) metadata.status = response.statusCode

    return metadata
  }

  private getMetadata(event: any): any {
    const {
      payload: { request, response, ...rest }
    } = event

    return { ...rest, ...this.getRequestResponseMetadata(request, response) }
  }

  private setTerminalPresenter(): void {
    core.TerminalPresenter.prependDocument('EXPRESS-DOC', { rows: [{ blocks: [{ text: ' ' }] }] })

    updatePresenterDoc()
  }
}
