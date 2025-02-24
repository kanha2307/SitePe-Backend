import AdminJS from "adminjs";
import AdminJSFastify from '@adminjs/fastify'
import * as AdminJSMongoose from '@adminjs/mongoose'
import * as Collect from '../models/index.js'
import { authenticate, COOKIE_PASSWORD, sessionStore } from "./config.js";
import {dark, light, noSidebar} from '@adminjs/themes'

AdminJS.registerAdapter(AdminJSMongoose)

export const admin = new AdminJS({
    resources: [
        {
            resource: Collect.Customer,
            options: {
                listProperties: ["phone", "role", "isActivated"],
                filterProperties: ["phone", "role"],
            }
        },
        {
            resource: Collect.DeliveryPartner,
            options: {
                listProperties: ["phone", "role", "isActivated"],
                filterProperties: ["phone", "role"],
            }
        },
        {
            resource: Collect.Admin,
            options:{
                listProperties: ["email", "role", "isActivated"],
                filterProperties: ["email", "role"]
            }
        },
        {
            resource: Collect.Branch,
        },
        {
            resource: Collect.Product,
        },
        {
            resource: Collect.Category,
        },
        {
            resource: Collect.Order,
        },
        {
            resource: Collect.Counter,
        }
    ],
    branding: {
        companyName: "SitePe",
        withMadeWithLove: false
    },
    defaultTheme: dark.id,
    availableThemes: [dark, light, noSidebar],
    rootPath: "/admin"
})

export const buildAdminRouter = async (app) => {
    await AdminJSFastify.buildAuthenticatedRouter(admin, {
        authenticate,
        cookiePassword: COOKIE_PASSWORD,
        cookieName: 'adminjs'
    }, app, {
        store: sessionStore,
        saveUnintialized: true,
        secret: COOKIE_PASSWORD,
        cookie: {
            httpOnly: process.env.NODE_ENV === "production",
            secure: process.env.NODE_ENV === "production"
        }
    })
}