import { BaseController, Controller, Get } from '@universal-packages/express-controllers'

@Controller('bad')
export default class BadController extends BaseController {
  @Get()
  public async getEnd(): Promise<void> {
    throw new Error('Bad request')
  }
}
