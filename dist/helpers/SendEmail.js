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
var SendEmail_exports = {};
__export(SendEmail_exports, {
  default: () => SendEmail_default
});
module.exports = __toCommonJS(SendEmail_exports);
var import_nodemailer = __toESM(require("nodemailer"));
var import_config = __toESM(require("../config"));
const EmailSender = (data) => __async(void 0, null, function* () {
  let transporter = import_nodemailer.default.createTransport({
    host: import_config.default.SMTP_ENDPOINT,
    port: 587,
    secure: false,
    // true for 465, false for other ports
    auth: {
      user: import_config.default.SMTP_USER,
      // generated ethereal user
      pass: import_config.default.SMTP_PASSWORD
      // generated ethereal password
    }
  });
  let info = yield transporter.sendMail({
    from: import_config.default.SMTP_FROM,
    // sender address
    to: data.to,
    // list of receivers
    subject: data.subject,
    // Subject line
    text: data.text,
    // plain text body
    html: data.html
    // html body
  });
  console.log("Message sent: %s", info.messageId);
});
var SendEmail_default = EmailSender;
