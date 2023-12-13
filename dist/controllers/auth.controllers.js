"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
var auth_controllers_exports = {};
__export(auth_controllers_exports, {
  ForgotPassword: () => ForgotPassword,
  Login: () => Login,
  ResetPassword: () => ResetPassword,
  SignupClient: () => SignupClient,
  VerifyEmail: () => VerifyEmail
});
module.exports = __toCommonJS(auth_controllers_exports);
var import_bcrypt = __toESM(require("bcrypt"));
var import_prismaClient = __toESM(require("../utils/prismaClient"));
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var import_config = __toESM(require("../config"));
var import_templates = require("../helpers/templates");
var import_SendEmail = __toESM(require("../helpers/SendEmail"));
const Login = (req, res) => __async(void 0, null, function* () {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      throw new Error("Faltan datos requeridos");
    const user = yield import_prismaClient.default.user.findUnique({
      where: {
        email
      }
    });
    if (!user)
      throw new Error("El usuario no existe");
    const isMatch = yield import_bcrypt.default.compare(password, user.password);
    if (!isMatch)
      throw new Error("Contrase\xF1a incorrecta");
    if (!user.verified)
      throw new Error("El correo no ha sido verificado");
    if (!user.active)
      throw new Error("El usuario no esta activo");
    const token = import_jsonwebtoken.default.sign({
      id: user.id,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      type: user.type
    }, import_config.default.SECRET_JWT || "", { expiresIn: "1d" });
    return res.status(200).json({ token, user });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
const SignupClient = (req, res) => __async(void 0, null, function* () {
  try {
    const { name, lastName, email, password } = req.body;
    if (!name || !lastName || !email || !password)
      throw new Error("Faltan datos requeridos");
    if (password.length < 8)
      throw new Error("La contrase\xF1a debe tener al menos 8 caracteres");
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,}$/;
    if (!regex.test(password))
      throw new Error("La contrase\xF1a debe tener al menos una letra may\xFAscula, una min\xFAscula, un n\xFAmero y un caracter especial ($@$!%*?&)");
    const regexEmail = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!regexEmail.test(email))
      throw new Error("El correo debe ser v\xE1lido");
    const emailExist = yield import_prismaClient.default.user.findUnique({ where: { email } });
    if (emailExist)
      throw new Error("El email ya existe");
    const salt = yield import_bcrypt.default.genSalt(10);
    const hash = yield import_bcrypt.default.hash(password, salt);
    const user = yield import_prismaClient.default.user.create({
      data: {
        name,
        lastName,
        email,
        password: hash,
        type: "client",
        active: true
      }
    });
    let flag = true;
    let token = "";
    while (flag) {
      token = Math.floor(1e5 + Math.random() * 9e5).toString();
      const verificationEmail = yield import_prismaClient.default.verificationEmail.findFirst({ where: { token } });
      if (!verificationEmail)
        flag = false;
    }
    yield import_prismaClient.default.verificationEmail.create({
      data: {
        userId: user.id,
        token
      }
    });
    const html = (0, import_templates.EmailVerificationTemplate)(user.name, `https://google.com/verify-email?token=${token}`, token);
    yield (0, import_SendEmail.default)({
      to: user.email,
      subject: "Verificaci\xF3n de correo electr\xF3nico",
      text: "Verificaci\xF3n de correo electr\xF3nico",
      html,
      from: import_config.default.SMTP_FROM || "javicentego@gmail.com"
    });
    return res.status(200).json({ message: "Usuario creado" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
const VerifyEmail = (req, res) => __async(void 0, null, function* () {
  try {
    const { token } = req.body;
    if (!token)
      throw new Error("Faltan datos requeridos");
    const verificationEmail = yield import_prismaClient.default.verificationEmail.findFirst({ where: { token } });
    if (!verificationEmail)
      throw new Error("El token no es v\xE1lido");
    const user = yield import_prismaClient.default.user.findUnique({ where: { id: verificationEmail.userId } });
    if (!user)
      throw new Error("El usuario no existe");
    yield import_prismaClient.default.user.update({
      where: {
        id: user.id
      },
      data: {
        verified: true
      }
    });
    yield import_prismaClient.default.verificationEmail.delete({
      where: {
        id: verificationEmail.id
      }
    });
    return res.status(200).json({ message: "Usuario verificado" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
const ForgotPassword = (req, res) => __async(void 0, null, function* () {
  try {
    const { email } = req.body;
    if (!email)
      throw new Error("Faltan datos requeridos");
    const user = yield import_prismaClient.default.user.findUnique({ where: { email } });
    if (!user)
      throw new Error("El email no existe");
    let flag = true;
    let token = "";
    while (flag) {
      token = Math.floor(1e5 + Math.random() * 9e5).toString();
      const resetPassword = yield import_prismaClient.default.resetPassword.findFirst({ where: { token } });
      if (!resetPassword)
        flag = false;
    }
    yield import_prismaClient.default.resetPassword.create({
      data: {
        userId: user.id,
        token
      }
    });
    const html = (0, import_templates.PasswordResetTemplate)(user.name, `https://google.com/reset-password?token=${token}`, token);
    yield (0, import_SendEmail.default)({
      to: user.email,
      subject: "Cambio de contrase\xF1a",
      text: "Cambio de contrase\xF1a",
      html,
      from: import_config.default.SMTP_FROM || "javicentego@gmail.com"
    });
    return res.status(200).json({ message: "Token creado" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
const ResetPassword = (req, res) => __async(void 0, null, function* () {
  try {
    const { token, password } = req.body;
    if (!token || !password)
      throw new Error("Faltan datos requeridos");
    const resetPassword = yield import_prismaClient.default.resetPassword.findFirst({ where: { token } });
    if (!resetPassword)
      throw new Error("El token no es v\xE1lido");
    const user = yield import_prismaClient.default.user.findUnique({ where: { id: resetPassword.userId } });
    if (!user)
      throw new Error("El usuario no existe");
    const salt = yield import_bcrypt.default.genSalt(10);
    const hash = yield import_bcrypt.default.hash(password, salt);
    yield import_prismaClient.default.user.update({
      where: {
        id: user.id
      },
      data: {
        password: hash
      }
    });
    yield import_prismaClient.default.resetPassword.delete({
      where: {
        id: resetPassword.id
      }
    });
    return res.status(200).json({ message: "Contrase\xF1a cambiada" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ForgotPassword,
  Login,
  ResetPassword,
  SignupClient,
  VerifyEmail
});
