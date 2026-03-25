
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { ContractService }    from './contract/contract.service';
import { ContractController } from './contract/contract.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  controllers: [CustomerController,ContractController],
  providers: [CustomerService,ContractService],
  exports: [CustomerService],
})
export class CustomerModule {}