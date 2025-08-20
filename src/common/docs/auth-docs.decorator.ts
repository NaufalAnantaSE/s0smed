import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';

export function AuthRegisterDocs() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiOperation({
      summary: 'Registrasi pengguna baru',
      description: 'Membuat akun pengguna baru dengan email, nama, dan password'
    }),
    ApiBody({
      description: 'Data registrasi pengguna',
      schema: {
        type: 'object',
        required: ['email', 'name', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'john.doe@example.com',
            description: 'Alamat email pengguna'
          },
          name: {
            type: 'string',
            example: 'John Doe',
            description: 'Nama lengkap pengguna'
          },
          password: {
            type: 'string',
            minLength: 6,
            example: 'password123',
            description: 'Password pengguna (minimal 6 karakter)'
          }
        }
      }
    }),
    ApiResponse({
      status: 201,
      description: 'Pengguna berhasil didaftarkan',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          email: { type: 'string', example: 'john.doe@example.com' },
          name: { type: 'string', example: 'John Doe' },
          bio: { type: 'string', nullable: true, example: null },
          avatar_url: { type: 'string', nullable: true, example: null },
          createdAt: { type: 'string', format: 'date-time', example: '2025-08-20T04:30:00.000Z' },
          updatedAt: { type: 'string', format: 'date-time', nullable: true, example: null }
        }
      }
    }),
    ApiResponse({
      status: 409,
      description: 'Pengguna sudah terdaftar',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'User already exists' },
          error: { type: 'string', example: 'Conflict' },
          statusCode: { type: 'number', example: 409 }
        }
      }
    })
  );
}

export function AuthLoginDocs() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiOperation({
      summary: 'Login pengguna',
      description: 'Autentikasi pengguna dengan email dan password, mengembalikan JWT token'
    }),
    ApiBody({
      description: 'Kredensial login pengguna',
      schema: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'john.doe@example.com',
            description: 'Alamat email pengguna'
          },
          password: {
            type: 'string',
            example: 'password123',
            description: 'Password pengguna'
          }
        }
      }
    }),
    ApiResponse({
      status: 200,
      description: 'Login berhasil',
      schema: {
        type: 'object',
        properties: {
          access_token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            description: 'JWT access token'
          }
        }
      }
    }),
    ApiResponse({
      status: 401,
      description: 'Kredensial tidak valid',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Invalid email or password' },
          error: { type: 'string', example: 'Unauthorized' },
          statusCode: { type: 'number', example: 401 }
        }
      }
    })
  );
}

export function AuthProfileDocs() {
  return applyDecorators(
    ApiTags('Auth'),
    ApiOperation({
      summary: 'Profil pengguna saat ini',
      description: 'Mendapatkan informasi profil pengguna yang sedang login'
    }),
    ApiResponse({
      status: 200,
      description: 'Profil pengguna berhasil diambil',
      schema: {
        type: 'object',
        properties: {
          userId: { type: 'number', example: 12 },
          email: { type: 'string', example: 'john.doe@example.com' }
        }
      }
    }),
    ApiResponse({
      status: 401,
      description: 'Tidak terotorisasi - Token tidak valid atau hilang'
    })
  );
}
