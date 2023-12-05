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
  Login: () => Login
});
module.exports = __toCommonJS(auth_controllers_exports);
var import_bcrypt = __toESM(require("bcrypt"));
var import_prismaClient = __toESM(require("../utils/prismaClient"));
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var import_config = __toESM(require("../config"));
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
      throw new Error("Credenciales incorrectas");
    if (!user.verified)
      throw new Error("El usuario no ha sido verificado");
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Login
});
