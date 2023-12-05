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
var test_routes_exports = {};
__export(test_routes_exports, {
  default: () => test_routes_default
});
module.exports = __toCommonJS(test_routes_exports);
var import_express = require("express");
var import_test = require("../controllers/test.controllers");
const testRouter = (0, import_express.Router)();
testRouter.get("/get", import_test.Test);
testRouter.post("/create-user", import_test.createUserTest);
testRouter.post("/create-vehicle", import_test.createVehicleTest);
testRouter.post("/send-location", import_test.SendLocationTest);
testRouter.get("/get-drivers-near", import_test.GetNearDriversTest);
var test_routes_default = testRouter;
