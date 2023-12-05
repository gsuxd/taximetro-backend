import { Request, Response } from "express";
import prisma from "../utils/prismaClient";
import bcrypt from 'bcrypt';

export const Test = async (req: Request, res: Response) => {
    try {

        const data = await prisma.$queryRaw`SELECT * FROM User`;
    
        console.log(data);

        return res.status(200).json({ message: 'Test' });
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
};

export const createUserTest = async (req: Request, res: Response) => {
    try {
        const { name, lastName, email, password, type } = req.body;

        if (!name || !lastName || !email || !password || !type) throw new Error('Faltan datos requeridos');

        if (type !== 'admin' && type !== 'user' && type !== 'driver') throw new Error('El tipo de usuario no es válido');

        await prisma.user.findFirst({ where: { email } }).then((user) => {
            if (user) throw new Error('El correo ya esta en uso');
        });

        const hash = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                lastName,
                email,
                password: hash,
                type,
                active: true,
                verified: true
            }
        });

        return res.status(200).json({ message: 'Usuario creado' });

    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
};

export const createVehicleTest = async (req: Request, res: Response) => {
    try {
        
        const { plate, brand, model, color, year, userId } = req.body;

        if (!plate || !brand || !model || !color || !year || !userId) throw new Error('Faltan datos requeridosd');

        if (isNaN(year)) throw new Error('El año debe ser un número');

        const user = await prisma.user.findUnique({ where: { id: userId, type: 'driver' } });
        if (!user) throw new Error('El usuario no existe o no es un conductor');

        await prisma.vehicle.create({
            data: {
                plate,
                brand,
                model,
                color,
                year: year.toString(),
                active: true,
                userId: user.id
            }
        });

        return res.status(200).json({ message: 'Vehículo creado' });

    } catch (error: any) {
        return res.status(400).json({ error: error.message }); 
    }
};

export const SendLocationTest = async (req: Request, res: Response) => {
    try {
        
        const { userId, longitude, latitude, address } = req.body;

        if (!userId || !longitude || !latitude || !address) throw new Error('Faltan datos requeridos');

        const user = await prisma.user.findUnique({ where: { id: userId, type: 'driver' } });
        if (!user) throw new Error('El usuario no existe o no es un conductor');

        await prisma.location.deleteMany({ where: { userId: user.id } });

        const geoPoint = 'POINT(' + longitude + ' ' + latitude + ')';

        await prisma.$queryRaw`INSERT INTO Location (userId, location, address) VALUES (${user.id}, ST_GeomFromText(${geoPoint}), ${address})`;

        return res.status(200).json({ message: 'Ubicación enviada' });

    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
};

export const GetNearDriversTest = async (req: Request, res: Response) => {
    try {
        
        const { longitude, latitude } = req.query;

        if (!longitude || !latitude) throw new Error('Faltan datos requeridos');

        // Usar formula de Haversine para calcular la distancia entre dos puntos
        // Obtener los conductores que esten a menos de 1km de distancia
        
        const drivers = await prisma.$queryRaw`
            SELECT id, address,
            (6371 * acos(cos(radians(${latitude})) * cos(radians(ST_Y(location))) * cos(radians(ST_X(location)) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(ST_Y(location))))) AS distance
            FROM Location
            WHERE (6371 * acos(cos(radians(${latitude})) * cos(radians(ST_Y(location))) * cos(radians(ST_X(location)) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(ST_Y(location))))) <= 1
            ORDER BY distance ASC
        `;

        return res.status(200).json({ drivers });

    } catch (error: any) {
        return res.status(400).json({ error: error.message });   
    }
};