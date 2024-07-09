import CoreInitializer from '@universal-packages/core/CoreInitializer'

export default class ExpressControllersInitializer extends CoreInitializer {
  public static readonly initializerName = 'express-controllers'
  public static readonly description: string = 'Core Express Controllers initializer'

  public readonly templatesLocation: string = `${__dirname}/templates`
}
