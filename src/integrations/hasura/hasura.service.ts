import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { GraphQLClient } from 'graphql-request';
import { DocumentNode } from 'graphql';

@Injectable()
export class HasuraService {
  // private client: GraphQLClient;
  // constructor(private configService: ConfigService) {
  //   this.client = new GraphQLClient(this.configService.get('HASURA_API_URL'), {
  //     headers: {
  //       'x-hasura-admin-secret': this.configService.get('HASURA_ADMIN_SECRET'),
  //     },
  //   });
  // }
  // async request<T = any>(document: DocumentNode, variables?: any): Promise<T> {
  //   return this.client.request<T>(document, variables);
  // }
  // async request(query: string, variables?: any): Promise<any> {
  //   return this.client.request(query, variables);
  // }
}
