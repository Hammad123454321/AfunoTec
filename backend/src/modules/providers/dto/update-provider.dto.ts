import { PartialType } from '@nestjs/swagger';
import { OnboardProviderDto } from './onboard-provider.dto';

/** All onboarding fields are optional when a provider updates their own profile. */
export class UpdateProviderDto extends PartialType(OnboardProviderDto) {}
