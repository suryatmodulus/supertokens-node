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
import { RecipeInterface } from "../";
import { RecipeInterface as JWTRecipeInterface } from "../../jwt/types";
import { SessionContainerInterface } from "../types";

const EXPIRY_OFFSET_SECONDS = 30;

export default (
    originalImplementation: RecipeInterface,
    jwtRecipeImplementation: JWTRecipeInterface
): RecipeInterface => {
    return {
        ...originalImplementation,
        createNewSession: async function ({
            res,
            userId,
            accessTokenPayload,
            sessionData,
        }: {
            res: any;
            userId: string;
            accessTokenPayload?: any;
            sessionData?: any;
        }): Promise<SessionContainerInterface> {
            let accessTokenValidityInSeconds = (await originalImplementation.getAccessTokenLifeTimeMS()) / 1000;
            let jwtResponse = await jwtRecipeImplementation.createJWT({
                payload: accessTokenPayload,
                validitySeconds: accessTokenValidityInSeconds + EXPIRY_OFFSET_SECONDS,
            });

            if (jwtResponse.status === "UNSUPPORTED_ALGORITHM_ERROR") {
                // Should never come here
                throw new Error("JWT Signing algorithm not supported");
            }

            accessTokenPayload = {
                ...accessTokenPayload,
                jwt: jwtResponse.jwt,
            };

            return await originalImplementation.createNewSession({
                res,
                userId,
                accessTokenPayload,
                sessionData,
            });
        },
        refreshSession: async function ({ req, res }: { req: any; res: any }): Promise<SessionContainerInterface> {
            let accessTokenValidityInSeconds = (await originalImplementation.getAccessTokenLifeTimeMS()) / 1000;

            // Refresh session first because this will create a new access token
            let newSession = await originalImplementation.refreshSession({ req, res });
            let accessTokenPayload = newSession.getAccessTokenPayload();

            // Remove the old jwt
            delete accessTokenPayload.jwt;

            let jwtResponse = await jwtRecipeImplementation.createJWT({
                payload: accessTokenPayload,
                validitySeconds: accessTokenValidityInSeconds + EXPIRY_OFFSET_SECONDS,
            });

            if (jwtResponse.status === "UNSUPPORTED_ALGORITHM_ERROR") {
                // Should never come here
                throw new Error("JWT Signing algorithm not supported");
            }

            accessTokenPayload = {
                ...accessTokenPayload,
                jwt: jwtResponse.jwt,
            };

            await newSession.updateAccessTokenPayload(accessTokenPayload);
            return newSession;
        },
        updateAccessTokenPayload: async function ({
            sessionHandle,
            newAccessTokenPayload,
        }: {
            sessionHandle: string;
            newAccessTokenPayload: any;
        }): Promise<void> {
            // Remove the JWT from the new access token payload
            delete newAccessTokenPayload.jwt;

            // Get the current sessions expiry to calculate the validity to use for the JWT
            let sessionInformation = await originalImplementation.getSessionInformation({ sessionHandle });
            let sessionExpiryInMillis = sessionInformation.expiry;
            let sessionvalidityInSeconds = (sessionExpiryInMillis - Date.now()) / 1000;

            let newJWTResponse = await jwtRecipeImplementation.createJWT({
                payload: newAccessTokenPayload,
                validitySeconds: sessionvalidityInSeconds + EXPIRY_OFFSET_SECONDS,
            });

            if (newJWTResponse.status === "UNSUPPORTED_ALGORITHM_ERROR") {
                // Should never come here
                throw new Error("JWT Signing algorithm not supported");
            }

            newAccessTokenPayload = {
                ...newAccessTokenPayload,
                jwt: newJWTResponse.jwt,
            };

            return await originalImplementation.updateAccessTokenPayload({ sessionHandle, newAccessTokenPayload });
        },
    };
};
