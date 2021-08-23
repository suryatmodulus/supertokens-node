/* Copyright (c) 2021, VRAI Labs and/or its affiliates. All rights reserved.
 *
 * This software is licensed under the Apache License, Version 2.0 (the
 * "License") as published by the Apache Software Foundation.
 *
 * You may not use this file except in compliance with the License. You may
 * obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import SuperTokensError from "./error";
import {
    VerifySessionOptions,
    RecipeInterface,
    SessionContainerInterface as SessionContainer,
    SessionInformation,
    APIInterface,
    APIOptions,
} from "./types";
import Recipe from "./recipe";
import framework from "./framework";
import type { SessionRequest } from "../../framework/express";

// For Express
export default class SessionWrapper {
    static init = Recipe.init;

    static Error = SuperTokensError;

    static createNewSession(res: any, userId: string, jwtPayload: any = {}, sessionData: any = {}) {
        return Recipe.getInstanceOrThrowError().recipeInterfaceImpl.createNewSession({
            res,
            userId,
            jwtPayload,
            sessionData,
        });
    }

    static getSession(req: any, res: any, options?: VerifySessionOptions) {
        return Recipe.getInstanceOrThrowError().recipeInterfaceImpl.getSession({ req, res, options });
    }

    static getSessionInformation(sessionHandle: string) {
        return Recipe.getInstanceOrThrowError().recipeInterfaceImpl.getSessionInformation({ sessionHandle });
    }

    static refreshSession(req: any, res: any) {
        return Recipe.getInstanceOrThrowError().recipeInterfaceImpl.refreshSession({ req, res });
    }

    static revokeAllSessionsForUser(userId: string) {
        return Recipe.getInstanceOrThrowError().recipeInterfaceImpl.revokeAllSessionsForUser({ userId });
    }

    static getAllSessionHandlesForUser(userId: string) {
        return Recipe.getInstanceOrThrowError().recipeInterfaceImpl.getAllSessionHandlesForUser({ userId });
    }

    static revokeSession(sessionHandle: string) {
        return Recipe.getInstanceOrThrowError().recipeInterfaceImpl.revokeSession({ sessionHandle });
    }

    static revokeMultipleSessions(sessionHandles: string[]) {
        return Recipe.getInstanceOrThrowError().recipeInterfaceImpl.revokeMultipleSessions({ sessionHandles });
    }

    /** @deprecated Use getSessionInformation instead IF using core version >= 3.5 **/
    static getSessionData(sessionHandle: string) {
        return Recipe.getInstanceOrThrowError().recipeInterfaceImpl.getSessionData({ sessionHandle });
    }

    static updateSessionData(sessionHandle: string, newSessionData: any) {
        return Recipe.getInstanceOrThrowError().recipeInterfaceImpl.updateSessionData({
            sessionHandle,
            newSessionData,
        });
    }

    /** @deprecated Use getSessionInformation instead IF using core version >= 3.5 **/
    static getJWTPayload(sessionHandle: string) {
        return Recipe.getInstanceOrThrowError().recipeInterfaceImpl.getJWTPayload({ sessionHandle });
    }

    static updateJWTPayload(sessionHandle: string, newJWTPayload: any) {
        return Recipe.getInstanceOrThrowError().recipeInterfaceImpl.updateJWTPayload({ sessionHandle, newJWTPayload });
    }
}

export let init = SessionWrapper.init;

export let createNewSession = SessionWrapper.createNewSession;

export let getSession = SessionWrapper.getSession;

export let getSessionInformation = SessionWrapper.getSessionInformation;

export let refreshSession = SessionWrapper.refreshSession;

export let revokeAllSessionsForUser = SessionWrapper.revokeAllSessionsForUser;

export let getAllSessionHandlesForUser = SessionWrapper.getAllSessionHandlesForUser;

export let revokeSession = SessionWrapper.revokeSession;

export let revokeMultipleSessions = SessionWrapper.revokeMultipleSessions;

/** @deprecated Use getSessionInformation instead IF using core version >= 3.5 **/
export let getSessionData = SessionWrapper.getSessionData;

export let updateSessionData = SessionWrapper.updateSessionData;

/** @deprecated Use getSessionInformation instead IF using core version >= 3.5 **/
export let getJWTPayload = SessionWrapper.getJWTPayload;

export let updateJWTPayload = SessionWrapper.updateJWTPayload;

/**
 * @deprecated
 */
export let verifySession = framework.express.verifySession;

export let Error = SessionWrapper.Error;

export type {
    VerifySessionOptions,
    RecipeInterface,
    SessionContainer,
    SessionRequest,
    APIInterface,
    APIOptions,
    SessionInformation,
};
