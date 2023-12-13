export const EmailVerificationTemplate = (name: string, link: string, code: string) => {

    const html = `
    <div style="width: 100%; height: 100%; background-color: #f2f2f2; padding: 20px;">
        <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px;">
            <div style="width: 100%; text-align: center;">
                <img src="https://i.ibb.co/0jZzQYH/logo.png" alt="logo" style="width: 100px; height: 100px;">
            </div>
            <div style="width: 100%; text-align: center; margin-top: 20px;">
                <h1 style="font-size: 24px; color: #000; margin: 0;">Hola ${name}</h1>
                <p style="font-size: 16px; color: #000; margin: 0;">Gracias por registrarte en <b>Transporte Seguro</b></p>
            </div>
            <div style="width: 100%; text-align: center; margin-top: 20px;">
                <p style="font-size: 16px; color: #000; margin: 0;">Para verificar tu cuenta, ingresa al siguiente enlace:</p>
                <a href="${link}" style="font-size: 16px; color: #000; margin: 0;">${link}</a>
            </div>
            <div style="width: 100%; text-align: center; margin-top: 20px;">
                <p style="font-size: 16px; color: #000; margin: 0;">O ingresa el siguiente código:</p>
                <p style="font-size: 16px; color: #000; margin: 0;">${code}</p>
            </div>
            <div style="width: 100%; text-align: center; margin-top: 20px;">
                <p style="font-size: 16px; color: #000; margin: 0;">Si no has creado una cuenta en <b>Transporte Seguro</b>, ignora este correo.</p>
            </div>
        </div>
    </div>
    `;

    return html;
};

export const PasswordResetTemplate = (name: string, link: string, code: string) => {
    
        const html = `
        <div style="width: 100%; height: 100%; background-color: #f2f2f2; padding: 20px;">
            <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px;">
                <div style="width: 100%; text-align: center;">
                    <img src="https://i.ibb.co/0jZzQYH/logo.png" alt="logo" style="width: 100px; height: 100px;">
                </div>
                <div style="width: 100%; text-align: center; margin-top: 20px;">
                    <h1 style="font-size: 24px; color: #000; margin: 0;">Hola ${name}</h1>
                    <p style="font-size: 16px; color: #000; margin: 0;">Has solicitado un cambio de contraseña en <b>Transporte Seguro</b></p>
                </div>
                <div style="width: 100%; text-align: center; margin-top: 20px;">
                    <p style="font-size: 16px; color: #000; margin: 0;">Para cambiar tu contraseña, ingresa al siguiente enlace:</p>
                    <a href="${link}" style="font-size: 16px; color: #000; margin: 0;">${link}</a>
                </div>
                <div style="width: 100%; text-align: center; margin-top: 20px;">
                    <p style="font-size: 16px; color: #000; margin: 0;">O ingresa el siguiente código:</p>
                    <p style="font-size: 16px; color: #000; margin: 0;">${code}</p>
                </div>
                <div style="width: 100%; text-align: center; margin-top: 20px;">
                    <p style="font-size: 16px; color: #000; margin: 0;">Si no has solicitado un cambio de contraseña en <b>Transporte Seguro</b>, ignora este correo.</p>
                </div>
            </div>
        </div>
        `;

        return html;
};    