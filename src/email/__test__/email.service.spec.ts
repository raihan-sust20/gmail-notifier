import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from '../email.service';
import { EmailQueryParam } from '../entities/email-query-param.entity';
import { emailQueryParamDbResult1 } from './email.service.spec.constant';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { EmailQueryParamRepositoryService } from '../repositories/email-query-param-repository.service';
import { Repository } from 'typeorm';

jest.mock('@nestjs/typeorm', () => {
  const originalModule = jest.requireActual('@nestjs/typeorm');

  return {
    ...originalModule,
    TypeOrmModule: class {
      static forRoot = jest.fn().mockImplementation(() => {
        return {};
      });
      static forFeature = jest.fn().mockImplementation(() => {
        return {};
      });
    },
  };
});

jest.mock('typeorm', () => {
  const originalModule = jest.requireActual('typeorm');

  return {
    ...originalModule,
    Repository: class<T> {
      entity: T;
      constructor(entity: T) {
        this.entity = entity;
      }

      find = jest.fn().mockImplementation(() => {
        return [
          {
            id: 1000,
            address: 'fake_userr1@fakemail.com',
            name: 'Fake Company, Inc.',
            qQuery: 'subject: faker-it',
            lastExecuted: '2021-12-03T05:40:44.408Z',
            dateCreated: '2021-12-03T05:40:44.408Z',
            dateUpdated: '2023-11-03T05:40:44.408Z',
          },
        ];
      });

      save = jest.fn().mockImplementation(() => {
        return {};
      });
    },
  };
});

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        EmailQueryParamRepositoryService,
        {
          provide: getRepositoryToken(EmailQueryParam),
          useValue: {
            find: jest.fn().mockImplementation(function () {
              return emailQueryParamDbResult1;
            }),

            save: jest.fn().mockImplementation(function () {
              return this;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    // emailQueryParamRepository = Repository<EmailQueryParam>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return email query param', async () => {
    const emailQueryParamsFromDb = await service.listEmailQueryParams();
    console.log('Email query param: ', emailQueryParamsFromDb);
    expect(emailQueryParamDbResult1).toStrictEqual(emailQueryParamsFromDb);
  });
});
