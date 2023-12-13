import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../utils/prismaClient';
import jwt from 'jsonwebtoken';
import config from '../config';
import { EmailVerificationTemplate, PasswordResetTemplate } from '../helpers/templates';
import EmailSender from '../helpers/SendEmail';

export const Login = async (req: Request, res: Response) => {
    try {
        
        const { email, password } = req.body;

        if (!email || !password) throw new Error('Faltan datos requeridos');

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) throw new Error('El usuario no existe');

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) throw new Error('Contraseña incorrecta');

        if (!user.verified) throw new Error('El correo no ha sido verificado');
        if (!user.active) throw new Error('El usuario no esta activo');

        const token = jwt.sign({
            id: user.id,
            email: user.email,
            name: user.name,
            lastName: user.lastName,
            type: user.type
        }, config.SECRET_JWT || '', { expiresIn: '1d' });

        return res.status(200).json({ token, user });

    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
};

// CREACIÓN DE USUARIOS DE TIPO CLIENTE
export const SignupClient = async (req: Request, res: Response) => {
    try {
        const { name, lastName, email, password } = req.body;

        if (!name || !lastName || !email || !password) throw new Error('Faltan datos requeridos');

        // La contraseña debe tener al menos 8 caracteres
        if (password.length < 8) throw new Error('La contraseña debe tener al menos 8 caracteres');

        // La contraseña debe tener al menos una letra mayúscula, una minúscula, un número y un caracter especial
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,}$/; // los caracteres especiales permitidos son: $@$!%*?&
        if (!regex.test(password)) throw new Error('La contraseña debe tener al menos una letra mayúscula, una minúscula, un número y un caracter especial ($@$!%*?&)');

        // El correo debe ser válido, debe permitir correos de todo tipo de dominio, no solo gmail, hotmail, etc.
        const regexEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if (!regexEmail.test(email)) throw new Error('El correo debe ser válido');

        const emailExist = await prisma.user.findUnique({ where: { email } });
        if (emailExist) throw new Error('El email ya existe');
        
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                name,
                lastName,
                email,
                password: hash,
                type: 'client',
                active: true,
            }
        });

        let flag = true;
        let token = '';
        while (flag) {
            // Codigo de 6 digitos numericos
            token = Math.floor(100000 + Math.random() * 900000).toString();
            const verificationEmail = await prisma.verificationEmail.findFirst({ where: { token } });
            if (!verificationEmail) flag = false;
        }

        await prisma.verificationEmail.create({
            data: {
                userId: user.id,
                token
            }
        });

        const html = EmailVerificationTemplate(user.name, `https://google.com/verify-email?token=${token}`, token);
        await EmailSender({
            to: user.email,
            subject: 'Verificación de correo electrónico',
            text: 'Verificación de correo electrónico',
            html,
            from: config.SMTP_FROM || 'javicentego@gmail.com'
        });

        return res.status(200).json({ message: 'Usuario creado' });

    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
};

export const VerifyEmail = async (req: Request, res: Response) => {
    try {

        const { token } = req.body;

        if (!token) throw new Error('Faltan datos requeridos');

        const verificationEmail = await prisma.verificationEmail.findFirst({ where: { token } });
        if (!verificationEmail) throw new Error('El token no es válido');

        const user = await prisma.user.findUnique({ where: { id: verificationEmail.userId } });
        if (!user) throw new Error('El usuario no existe');

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                verified: true
            }
        });

        await prisma.verificationEmail.delete({
            where: {
                id: verificationEmail.id
            }
        });

        return res.status(200).json({ message: 'Usuario verificado' });

    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
}

export const ForgotPassword = async (req: Request, res: Response) => {
    try {

        const { email } = req.body;

        if (!email) throw new Error('Faltan datos requeridos');

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new Error('El email no existe');

        let flag = true;
        let token = '';
        while (flag) {
            // Codigo de 6 digitos numericos
            token = Math.floor(100000 + Math.random() * 900000).toString();
            const resetPassword = await prisma.resetPassword.findFirst({ where: { token } });
            if (!resetPassword) flag = false;
        }

        await prisma.resetPassword.create({
            data: {
                userId: user.id,
                token
            }
        });

        const html = PasswordResetTemplate(user.name, `https://google.com/reset-password?token=${token}`, token);
        await EmailSender({
            to: user.email,
            subject: 'Cambio de contraseña',
            text: 'Cambio de contraseña',
            html,
            from: config.SMTP_FROM || 'javicentego@gmail.com'
        });

        return res.status(200).json({ message: 'Token creado' });

    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
}

export const ResetPassword = async (req: Request, res: Response) => {
    try {

        const { token, password } = req.body;

        if (!token || !password) throw new Error('Faltan datos requeridos');

        const resetPassword = await prisma.resetPassword.findFirst({ where: { token } });
        if (!resetPassword) throw new Error('El token no es válido');

        const user = await prisma.user.findUnique({ where: { id: resetPassword.userId } });
        if (!user) throw new Error('El usuario no existe');

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                password: hash
            }
        });

        await prisma.resetPassword.delete({
            where: {
                id: resetPassword.id
            }
        });

        return res.status(200).json({ message: 'Contraseña cambiada' });

    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
}