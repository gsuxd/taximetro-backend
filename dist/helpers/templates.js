"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var templates_exports = {};
__export(templates_exports, {
  EmailVerificationTemplate: () => EmailVerificationTemplate,
  PasswordResetTemplate: () => PasswordResetTemplate
});
module.exports = __toCommonJS(templates_exports);
const EmailVerificationTemplate = (name, link, code) => {
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
                <p style="font-size: 16px; color: #000; margin: 0;">O ingresa el siguiente c\xF3digo:</p>
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
const PasswordResetTemplate = (name, link, code) => {
  const html = `
        <div style="width: 100%; height: 100%; background-color: #f2f2f2; padding: 20px;">
            <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 10px;">
                <div style="width: 100%; text-align: center;">
                    <img src="https://i.ibb.co/0jZzQYH/logo.png" alt="logo" style="width: 100px; height: 100px;">
                </div>
                <div style="width: 100%; text-align: center; margin-top: 20px;">
                    <h1 style="font-size: 24px; color: #000; margin: 0;">Hola ${name}</h1>
                    <p style="font-size: 16px; color: #000; margin: 0;">Has solicitado un cambio de contrase\xF1a en <b>Transporte Seguro</b></p>
                </div>
                <div style="width: 100%; text-align: center; margin-top: 20px;">
                    <p style="font-size: 16px; color: #000; margin: 0;">Para cambiar tu contrase\xF1a, ingresa al siguiente enlace:</p>
                    <a href="${link}" style="font-size: 16px; color: #000; margin: 0;">${link}</a>
                </div>
                <div style="width: 100%; text-align: center; margin-top: 20px;">
                    <p style="font-size: 16px; color: #000; margin: 0;">O ingresa el siguiente c\xF3digo:</p>
                    <p style="font-size: 16px; color: #000; margin: 0;">${code}</p>
                </div>
                <div style="width: 100%; text-align: center; margin-top: 20px;">
                    <p style="font-size: 16px; color: #000; margin: 0;">Si no has solicitado un cambio de contrase\xF1a en <b>Transporte Seguro</b>, ignora este correo.</p>
                </div>
            </div>
        </div>
        `;
  return html;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EmailVerificationTemplate,
  PasswordResetTemplate
});
