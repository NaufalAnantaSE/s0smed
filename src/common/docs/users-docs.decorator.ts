import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam, ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';

export function GetUsersDocs() {
  return applyDecorators(
    ApiTags('Users'),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get all users',
      description: 'Retrieve list of all users'
    }),
    ApiResponse({
      status: 200,
      description: 'Users retrieved successfully',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            avatar_url: { type: 'string', nullable: true, example: 'https://...' },
            followers_count: { type: 'number', example: 10 },
            following_count: { type: 'number', example: 5 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time', nullable: true }
          }
        }
      }
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized'
    })
  );
}

export function GetCurrentUserDocs() {
  return applyDecorators(
    ApiTags('Users'),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get current user profile',
      description: 'Retrieve the authenticated user profile from JWT token'
    }),
    ApiResponse({
      status: 200,
      description: 'Current user profile retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'John Doe' },
          email: { type: 'string', example: 'john@example.com' },
          avatar_url: { type: 'string', nullable: true, example: 'https://...' },
          followers_count: { type: 'number', example: 10 },
          following_count: { type: 'number', example: 5 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time', nullable: true }
        }
      }
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing token'
    })
  );
}

export function GetUserByIdDocs() {
  return applyDecorators(
    ApiTags('Users'),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get user by ID',
      description: 'Retrieve a specific user by their ID'
    }),
    ApiParam({
      name: 'id',
      type: 'number',
      description: 'User ID',
      example: 1
    }),
    ApiResponse({
      status: 200,
      description: 'User retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'John Doe' },
          email: { type: 'string', example: 'john@example.com' },
          avatar_url: { type: 'string', nullable: true, example: 'https://...' },
          followers_count: { type: 'number', example: 10 },
          following_count: { type: 'number', example: 5 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time', nullable: true }
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

export function UpdateCurrentUserPhotoDocs() {
  return applyDecorators(
    ApiTags('Users'),
    ApiBearerAuth(),
    ApiConsumes('multipart/form-data'),
    ApiOperation({
      summary: 'Update current user profile photo',
      description: 'Update authenticated user profile photo (no ID required - uses JWT token)'
    }),
    ApiBody({
      description: 'Profile photo upload',
      schema: {
        type: 'object',
        properties: {
          avatar_url: {
            type: 'string',
            format: 'binary',
            description: 'Avatar image file'
          }
        },
        required: ['avatar_url']
      }
    }),
    ApiResponse({
      status: 200,
      description: 'Profile photo updated successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'John Doe' },
          email: { type: 'string', example: 'john@example.com' },
          avatar_url: { type: 'string', example: 'https://...' },
          followers_count: { type: 'number', example: 10 },
          following_count: { type: 'number', example: 5 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Invalid file or validation failed'
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized'
    })
  );
}

export function UpdateCurrentUserDocs() {
  return applyDecorators(
    ApiTags('Users'),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Update current user profile',
      description: 'Update authenticated user profile (no ID required - uses JWT token)'
    }),
    ApiBody({
      description: 'User update data',
      schema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            example: 'Updated Name',
            description: 'User name (optional)'
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'newemail@example.com',
            description: 'User email (optional)'
          },
          password: {
            type: 'string',
            minLength: 6,
            example: 'newpassword123',
            description: 'New password (optional, min 6 characters)'
          }
        }
      }
    }),
    ApiResponse({
      status: 200,
      description: 'User updated successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Updated Name' },
          email: { type: 'string', example: 'newemail@example.com' },
          avatar_url: { type: 'string', nullable: true, example: 'https://...' },
          followers_count: { type: 'number', example: 10 },
          following_count: { type: 'number', example: 5 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Validation failed'
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized'
    })
  );
}

export function DeleteCurrentUserDocs() {
  return applyDecorators(
    ApiTags('Users'),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Delete current user account',
      description: 'Delete authenticated user account (no ID required - uses JWT token)'
    }),
    ApiResponse({
      status: 200,
      description: 'User deleted successfully',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'User deleted successfully' }
        }
      }
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized'
    })
  );
}

export function UpdateUserDocs() {
  return applyDecorators(
    ApiTags('Users'),
    ApiBearerAuth(),
    ApiConsumes('multipart/form-data'),
    ApiOperation({
      summary: 'Update user profile',
      description: 'Update user profile with optional avatar upload'
    }),
    ApiParam({
      name: 'id',
      type: 'number',
      description: 'User ID',
      example: 1
    }),
    ApiBody({
      description: 'User update data',
      schema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            example: 'Updated Name',
            description: 'User name (optional)'
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'newemail@example.com',
            description: 'User email (optional)'
          },
          password: {
            type: 'string',
            minLength: 6,
            example: 'newpassword123',
            description: 'New password (optional, min 6 characters)'
          },
          avatar: {
            type: 'string',
            format: 'binary',
            description: 'Avatar image file (optional)'
          }
        }
      }
    }),
    ApiResponse({
      status: 200,
      description: 'User updated successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Updated Name' },
          email: { type: 'string', example: 'newemail@example.com' },
          avatar_url: { type: 'string', nullable: true, example: 'https://...' },
          followers_count: { type: 'number', example: 10 },
          following_count: { type: 'number', example: 5 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request - Validation failed'
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized'
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - You can only update your own profile'
    }),
    ApiResponse({
      status: 404,
      description: 'User not found'
    })
  );
}

export function DeleteUserDocs() {
  return applyDecorators(
    ApiTags('Users'),
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Delete user',
      description: 'Delete user account (only by owner)'
    }),
    ApiParam({
      name: 'id',
      type: 'number',
      description: 'User ID',
      example: 1
    }),
    ApiResponse({
      status: 200,
      description: 'User deleted successfully',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'User deleted successfully' }
        }
      }
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized'
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - You can only delete your own account'
    }),
    ApiResponse({
      status: 404,
      description: 'User not found'
    })
  );
}
