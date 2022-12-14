import { CoreApp } from '@universal-packages/core'
import { ExpressApp, ExpressAppOptions } from '@universal-packages/express-controllers'
import { TerminalTransport } from '@universal-packages/logger'
import { Request, Response } from 'express'

export default class ExpressCoreApp extends CoreApp<ExpressAppOptions> {
  public static readonly appName = 'express-app'
  public static readonly description = 'Express Core App'
  public static readonly defaultConfig: ExpressAppOptions = { appLocation: './src' }

  public expressApp: ExpressApp

  public async prepare(): Promise<void> {
    const terminalTransport = this.logger.getTransport('terminal') as TerminalTransport
    terminalTransport.options.categoryColors['EXPRESS'] = 'BLUE'

    this.expressApp = new ExpressApp(this.config)

    this.expressApp.on('request/start', ({ request }): void => {
      this.logger.publish('INFO', null, `Incoming ${request.method} ${request.originalUrl}`, 'EXPRESS')
    })

    this.expressApp.on('request/not-found', ({ request, response, measurement }): void => {
      this.logger.publish('WARNING', null, 'No handler configured for this route', 'EXPRESS', {
        metadata: this.getRequestResponseMetadata(request, response),
        measurement: measurement.toString()
      })
    })

    this.expressApp.on('request/error', ({ error, handler, request, response, measurement }): void => {
      this.logger.publish('ERROR', null, 'There was an error while handling the request', 'EXPRESS', {
        error,
        metadata: { handler, ...this.getRequestResponseMetadata(request, response) },
        measurement: measurement.toString()
      })
    })

    this.expressApp.on('request/middleware', ({ name }): void => {
      this.logger.publish('DEBUG', null, `Using middleware ${name}`, 'EXPRESS')
    })

    this.expressApp.on('request/handler', ({ handler }): void => {
      this.logger.publish('DEBUG', null, `Handling with ${handler}`, 'EXPRESS')
    })

    this.expressApp.on('request/end', ({ request, response, handler, measurement }): void => {
      this.logger.publish('INFO', null, `Handled with ${handler}`, 'EXPRESS', { metadata: this.getRequestResponseMetadata(request, response), measurement: measurement.toString() })
    })

    await this.expressApp.prepare()
  }

  public async run(): Promise<void> {
    await this.expressApp.run()
  }

  public async stop(): Promise<void> {
    await this.expressApp.stop()
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
