import { CoreApp } from '@universal-packages/core'
import { ExpressApp, ExpressAppOptions } from '@universal-packages/express-controllers'
import { TerminalTransport } from '@universal-packages/logger'
import { Request } from 'express'

export default class JobsWorkerApp extends CoreApp<ExpressAppOptions> {
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

    this.expressApp.on('request/not-found', ({ request, measurement }): void => {
      this.logger.publish('WARNING', null, 'No handler configured for this route', 'EXPRESS', { metadata: this.getRequestMetadata(request), measurement: measurement.toString() })
    })

    this.expressApp.on('request/error', ({ error, handler, request, measurement }): void => {
      this.logger.publish('ERROR', null, 'There was an error while handilng the request', 'EXPRESS', {
        error,
        metadata: { handler, ...this.getRequestMetadata(request) },
        measurement: measurement.toString()
      })
    })

    this.expressApp.on('request/middleware', ({ name }): void => {
      this.logger.publish('DEBUG', null, `Using middleware ${name}`, 'EXPRESS')
    })

    this.expressApp.on('request/hadler', ({ handler }): void => {
      this.logger.publish('DEBUG', null, `Handling with ${handler}`, 'EXPRESS')
    })

    this.expressApp.on('request/end', ({ request, handler, measurement }): void => {
      this.logger.publish('INFO', null, `Handled ${handler}`, 'EXPRESS', { metadata: this.getRequestMetadata(request), measurement: measurement.toString() })
    })

    await this.expressApp.prepare()
  }

  public async run(): Promise<void> {
    await this.expressApp.run()
  }

  public async stop(): Promise<void> {
    await this.expressApp.stop()
  }

  private getRequestMetadata(request: Request): any {
    const hasParams = Object.keys(request.params || {}).length > 0
    const hasQuery = Object.keys(request.query || {}).length > 0
    const hasBody = !!request.body
    const metadata: any = {}

    if (hasParams) metadata.params = request.params
    if (hasQuery) metadata.query = request.query
    if (hasBody) metadata.body = request.body
    metadata.route = `${request.method} ${request.path}`

    return metadata
  }
}
