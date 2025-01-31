"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const itemRoute_1 = __importDefault(require("./routes/itemRoute"));
/* CONFIGURATIONS */
dotenv_1.default.config();
const isProduction = process.env.NODE_ENV === "production";
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use(helmet_1.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use((0, morgan_1.default)("common"));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
if (process.env.MONGO_DB) {
    mongoose_1.default
        .connect(process.env.MONGO_DB)
        .then((result) => {
        console.log("connected to Mongodb");
    })
        .catch((err) => {
        console.error(err);
    });
}
/* ROUTES */
app.use("/items", itemRoute_1.default);
/* SERVER */
const port = process.env.PORT || 3000;
if (!isProduction) {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}
