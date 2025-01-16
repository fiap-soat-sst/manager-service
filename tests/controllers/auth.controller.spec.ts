import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Request, Response } from 'express'
import AuthController from '../../src/Controllers/AuthController'
import LoginUseCase from '../../src/UseCases/Auth/login/login.usecase'
import { Left, Right } from '../../src/@Shared/Either'
import RegisterUseCase from '../../src/UseCases/Auth/register/register.usecase'

describe('AuthController', () => {
    let authController: AuthController
    let loginUseCase: LoginUseCase
    let registerUseCase: RegisterUseCase

    beforeEach(() => {
        loginUseCase = {
            execute: vi.fn(),
        } as unknown as LoginUseCase

        registerUseCase = {
            execute: vi.fn(),
        } as unknown as RegisterUseCase
        authController = new AuthController(loginUseCase, registerUseCase)
    })

    it('should return 400 if email or password is missing', async () => {
        const req = {
            body: {},
        } as Request
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response

        await authController.login(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({
            message: 'Email e senha são obrigatórios.',
        })
    })

    it('should return 400 if login credentials are invalid', async () => {
        const req = {
            body: { email: 'test@example.com', password: 'wrongpassword' },
        } as Request
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response

        loginUseCase.execute = vi
            .fn()
            .mockResolvedValue(Left({ message: 'Invalid user or password' }))

        await authController.login(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith('Invalid user or password')
    })

    it('should return 200 if login is successful', async () => {
        const req = {
            body: { email: 'test@example.com', password: 'correctpassword' },
        } as Request
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response

        loginUseCase.execute = vi
            .fn()
            .mockResolvedValue(Right({ accessToken: 'valid-token' }))

        await authController.login(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ accessToken: 'valid-token' })
    })

    it('should return 400 if registration data is missing', async () => {
        const req = {
            body: {},
        } as Request
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response

        await authController.register(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({
            message: 'Email e senha são obrigatórios.',
        })
    })

    it('should return 400 if registration fails', async () => {
        const req = {
            body: {
                email: 'test@example.com',
                password: 'password',
            },
        } as Request
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response

        registerUseCase.execute = vi
            .fn()
            .mockResolvedValue(Left({ message: 'Registration failed' }))

        await authController.register(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith('Registration failed')
    })

    it('should return 201 if registration is successful', async () => {
        const req = {
            body: {
                email: 'test@example.com',
                password: 'password',
            },
        } as Request
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        } as unknown as Response

        registerUseCase.execute = vi
            .fn()
            .mockResolvedValue(
                Right({ message: 'User registered successfully.' })
            )

        await authController.register(req, res)

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({
            message: 'User registered successfully.',
        })
    })
})
