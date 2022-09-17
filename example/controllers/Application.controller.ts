import { BaseController, Controller, Get } from '@universal-packages/express-controllers'

@Controller()
export default class ApplicationController extends BaseController {
  @Get()
  public async test(): Promise<void> {
    throw new Error('Bad')
  }
}
