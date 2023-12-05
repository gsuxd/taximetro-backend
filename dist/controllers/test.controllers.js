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
var test_controllers_exports = {};
__export(test_controllers_exports, {
  GetNearDriversTest: () => GetNearDriversTest,
  SendLocationTest: () => SendLocationTest,
  Test: () => Test,
  createUserTest: () => createUserTest,
  createVehicleTest: () => createVehicleTest
});
module.exports = __toCommonJS(test_controllers_exports);
var import_prismaClient = __toESM(require("../utils/prismaClient"));
var import_bcrypt = __toESM(require("bcrypt"));
const Test = (req, res) => __async(void 0, null, function* () {
  try {
    const data = yield import_prismaClient.default.$queryRaw`SELECT * FROM User`;
    console.log(data);
    return res.status(200).json({ message: "Test" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
const createUserTest = (req, res) => __async(void 0, null, function* () {
  try {
    const { name, lastName, email, password, type } = req.body;
    if (!name || !lastName || !email || !password || !type)
      throw new Error("Faltan datos requeridos");
    if (type !== "admin" && type !== "user" && type !== "driver")
      throw new Error("El tipo de usuario no es v\xE1lido");
    yield import_prismaClient.default.user.findFirst({ where: { email } }).then((user) => {
      if (user)
        throw new Error("El correo ya esta en uso");
    });
    const hash = yield import_bcrypt.default.hash(password, 10);
    yield import_prismaClient.default.user.create({
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
    return res.status(200).json({ message: "Usuario creado" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
const createVehicleTest = (req, res) => __async(void 0, null, function* () {
  try {
    const { plate, brand, model, color, year, userId } = req.body;
    if (!plate || !brand || !model || !color || !year || !userId)
      throw new Error("Faltan datos requeridosd");
    if (isNaN(year))
      throw new Error("El a\xF1o debe ser un n\xFAmero");
    const user = yield import_prismaClient.default.user.findUnique({ where: { id: userId, type: "driver" } });
    if (!user)
      throw new Error("El usuario no existe o no es un conductor");
    yield import_prismaClient.default.vehicle.create({
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
    return res.status(200).json({ message: "Veh\xEDculo creado" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
const SendLocationTest = (req, res) => __async(void 0, null, function* () {
  try {
    const { userId, longitude, latitude, address } = req.body;
    if (!userId || !longitude || !latitude || !address)
      throw new Error("Faltan datos requeridos");
    const user = yield import_prismaClient.default.user.findUnique({ where: { id: userId, type: "driver" } });
    if (!user)
      throw new Error("El usuario no existe o no es un conductor");
    yield import_prismaClient.default.location.deleteMany({ where: { userId: user.id } });
    const geoPoint = "POINT(" + longitude + " " + latitude + ")";
    yield import_prismaClient.default.$queryRaw`INSERT INTO Location (userId, location, address) VALUES (${user.id}, ST_GeomFromText(${geoPoint}), ${address})`;
    return res.status(200).json({ message: "Ubicaci\xF3n enviada" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
const GetNearDriversTest = (req, res) => __async(void 0, null, function* () {
  try {
    const { longitude, latitude } = req.query;
    if (!longitude || !latitude)
      throw new Error("Faltan datos requeridos");
    const drivers = yield import_prismaClient.default.$queryRaw`
            SELECT id, address,
            (6371 * acos(cos(radians(${latitude})) * cos(radians(ST_Y(location))) * cos(radians(ST_X(location)) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(ST_Y(location))))) AS distance
            FROM Location
            WHERE (6371 * acos(cos(radians(${latitude})) * cos(radians(ST_Y(location))) * cos(radians(ST_X(location)) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(ST_Y(location))))) <= 1
            ORDER BY distance ASC
        `;
    return res.status(200).json({ drivers });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetNearDriversTest,
  SendLocationTest,
  Test,
  createUserTest,
  createVehicleTest
});
