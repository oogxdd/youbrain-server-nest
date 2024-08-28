// import { Injectable } from '@nestjs/common';
// import { GraphQLClient } from 'graphql-request';

// @Injectable()
// export class HasuraService {
//   private client: GraphQLClient;

//   constructor() {
//     this.client = new GraphQLClient(process.env.HASURA_ENDPOINT, {
//       headers: {
//         'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
//       },
//     });
//   }

//   async createVideoRecord(userId: string, videoUrl: string): Promise<string> {
//     const mutation = `
//       mutation CreateVideo($userId: String!, $videoUrl: String!) {
//         insert_videos_one(object: {user_id: $userId, url: $videoUrl, status: "uploaded"}) {
//           id
//         }
//       }
//     `;

//     const variables = { userId, videoUrl };

//     try {
//       const response = await this.client.request(mutation, variables);
//       return response.insert_videos_one.id;
//     } catch (error) {
//       console.error('Error creating video record in Hasura:', error);
//       throw new Error('Failed to create video record');
//     }
//   }

//   async updateVideoStatus(videoId: string, status: string): Promise<void> {
//     const mutation = `
//       mutation UpdateVideoStatus($videoId: uuid!, $status: String!) {
//         update_videos_by_pk(pk_columns: {id: $videoId}, _set: {status: $status}) {
//           id
//         }
//       }
//     `;

//     const variables = { videoId, status };

//     try {
//       await this.client.request(mutation, variables);
//     } catch (error) {
//       console.error('Error updating video status in Hasura:', error);
//       throw new Error('Failed to update video status');
//     }
//   }
// }
