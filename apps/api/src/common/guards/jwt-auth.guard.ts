import { CanActivate, type ExecutionContext, Injectable } from '@nestjs/common'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(_context: ExecutionContext): boolean {
    // Scaffold boundary: auth enforcement will be added in a later phase.
    return true
  }
}
