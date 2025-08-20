import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiTags, ApiBearerAuth } from '@nestjs/swagger';

export function FollowUserDocs() {
  return applyDecorators(
    ApiTags('Follow'),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Follow user',
      description: 'Follow another user'
    }),
    ApiParam({
      name: 'id',
      type: 'number',
      description: 'User ID to follow',
      example: 2
    }),
    ApiResponse({
      status: 201,
      description: 'User followed successfully',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Successfully followed user' },
          followedUser: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 2 },
              name: { type: 'string', example: 'Jane Doe' },
              email: { type: 'string', example: 'jane@example.com' },
              followers_count: { type: 'number', example: 11 }
            }
          }
        }
      }
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Cannot follow yourself or already following'
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized'
    }),
    ApiResponse({
      status: 404,
      description: 'User to follow not found'
    })
  );
}

export function UnfollowUserDocs() {
  return applyDecorators(
    ApiTags('Follow'),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Unfollow user',
      description: 'Unfollow a user you are currently following'
    }),
    ApiParam({
      name: 'id',
      type: 'number',
      description: 'User ID to unfollow',
      example: 2
    }),
    ApiResponse({
      status: 200,
      description: 'User unfollowed successfully',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Successfully unfollowed user' },
          unfollowedUser: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 2 },
              name: { type: 'string', example: 'Jane Doe' },
              email: { type: 'string', example: 'jane@example.com' },
              followers_count: { type: 'number', example: 9 }
            }
          }
        }
      }
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Not following this user'
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized'
    }),
    ApiResponse({
      status: 404,
      description: 'User to unfollow not found'
    })
  );
}

export function GetUserFollowersDocs() {
  return applyDecorators(
    ApiTags('Follow'),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get user followers',
      description: 'Get list of users who follow the specified user'
    }),
    ApiParam({
      name: 'id',
      type: 'number',
      description: 'User ID',
      example: 1
    }),
    ApiResponse({
      status: 200,
      description: 'Followers retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          followers: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 2 },
                name: { type: 'string', example: 'Jane Doe' },
                email: { type: 'string', example: 'jane@example.com' },
                avatar_url: { type: 'string', nullable: true, example: 'https://...' },
                followers_count: { type: 'number', example: 5 },
                following_count: { type: 'number', example: 10 },
                followedAt: { type: 'string', format: 'date-time' }
              }
            }
          },
          count: { type: 'number', example: 3 }
        }
      }
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized'
    }),
    ApiResponse({
      status: 404,
      description: 'User not found'
    })
  );
}

export function GetUserFollowingDocs() {
  return applyDecorators(
    ApiTags('Follow'),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get user following',
      description: 'Get list of users that the specified user is following'
    }),
    ApiParam({
      name: 'id',
      type: 'number',
      description: 'User ID',
      example: 1
    }),
    ApiResponse({
      status: 200,
      description: 'Following list retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          following: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 3 },
                name: { type: 'string', example: 'Bob Smith' },
                email: { type: 'string', example: 'bob@example.com' },
                avatar_url: { type: 'string', nullable: true, example: 'https://...' },
                followers_count: { type: 'number', example: 15 },
                following_count: { type: 'number', example: 8 },
                followedAt: { type: 'string', format: 'date-time' }
              }
            }
          },
          count: { type: 'number', example: 2 }
        }
      }
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized'
    }),
    ApiResponse({
      status: 404,
      description: 'User not found'
    })
  );
}
