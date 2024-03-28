import { CoreApp } from '@universal-packages/core'
import { ExpressControllers, ExpressControllersOptions } from '@universal-packages/express-controllers'
import { Request, Response } from 'express'

import { LOG_CONFIGURATION } from './LOG_CONFIGURATION'

export default class ExpressControllersApp extends CoreApp<ExpressControllersOptions> {
  public static readonly appName = 'express-controllers'
  public static readonly description = 'Express Controllers Core App'
  public static readonly defaultConfig: ExpressControllersOptions = { appLocation: './src' }

  public expressControllers: ExpressControllers

  public async prepare(): Promise<void> {
    this.expressControllers = new ExpressControllers({ ...this.config, port: this.args.port || this.args.p || this.config.port })

    this.expressControllers.on('request:start', (event): void => {
      const request = event.payload.request

      this.logger.log(
        {
          level: 'INFO',
          title: 'Request start',
          message: `Incoming ${request.method} ${request.originalUrl}`,
          category: 'EXPRESS'
        },
        LOG_CONFIGURATION
      )
    })

    this.expressControllers.on('request:not-found', (event): void => {
      const { payload, measurement } = event
      const { request, response } = payload

      this.logger.log(
        {
          level: 'WARNING',
          title: 'No handler configured for the route',
          category: 'EXPRESS',
          metadata: this.getRequestResponseMetadata(request, response),
          measurement: measurement.toString()
        },
        LOG_CONFIGURATION
      )
    })

    this.expressControllers.on('request:error', (event): void => {
      const { payload, measurement, error } = event
      const { request, response, handler } = payload

      this.logger.log(
        {
          level: 'ERROR',
          title: 'There was an error while handling the request',
          category: 'EXPRESS',
          error,
          metadata: { handler, ...this.getRequestResponseMetadata(request, response) },
          measurement: measurement.toString()
        },
        LOG_CONFIGURATION
      )
    })

    this.expressControllers.on('request:middleware', (event): void => {
      const name = event.payload.name

      this.logger.log({ level: 'DEBUG', title: `Using middleware ${name}`, category: 'EXPRESS' }, LOG_CONFIGURATION)
    })

    this.expressControllers.on('request:handler', (event): void => {
      const handler = event.payload.handler

      this.logger.log({ level: 'DEBUG', title: `Handling with ${handler}`, category: 'EXPRESS' }, LOG_CONFIGURATION)
    })

    this.expressControllers.on('request:end', (event): void => {
      const { payload, measurement } = event
      const { request, response, handler } = payload

      this.logger.log(
        {
          level: 'INFO',
          title: `Handled with ${handler}`,
          category: 'EXPRESS',
          metadata: this.getRequestResponseMetadata(request, response),
          measurement: measurement.toString()
        },
        LOG_CONFIGURATION
      )
    })

    this.expressControllers.on('warning', (event): void => {
      const { message } = event

      this.logger.log({ level: 'WARNING', message, category: 'EXPRESS' }, LOG_CONFIGURATION)
    })

    await this.expressControllers.prepare()
  }

  public async run(): Promise<void> {
    await this.expressControllers.run()
  }

  public async stop(): Promise<void> {
    await this.expressControllers.stop()
  }

  private getRequestResponseMetadata(request: Request, response: Response): any {
    const hasParams = Object.keys(request.params || {}).length > 0
    const hasQuery = Object.keys(request.query || {}).length > 0
    const hasBody = !!request.body
    const metadata: any = {}

    if (hasParams) metadata.params = request.params
    if (hasQuery) metadata.query = request.query
    if (hasBody) metadata.body = request.body
    metadata.route = `${request.method} ${request.path}`
    metadata.status = response.statusCode

    return metadata
  }
}
