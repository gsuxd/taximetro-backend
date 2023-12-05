import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../utils/prismaClient';
import jwt from 'jsonwebtoken';
import config from '../config';

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

        if (!isMatch) throw new Error('Credenciales incorrectas');

        if (!user.verified) throw new Error('El usuario no ha sido verificado');
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