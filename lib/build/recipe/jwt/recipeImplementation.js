"use strict";
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
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
Object.defineProperty(exports, "__esModule", { value: true });
const normalisedURLPath_1 = require("../../normalisedURLPath");
function getRecipeInterface(querier, config, appInfo) {
    return {
        createJWT: function ({ payload, validitySeconds }) {
            return __awaiter(this, void 0, void 0, function* () {
                if (validitySeconds === undefined) {
                    // If the user does not provide a validity to this function and the config validity is also undefined, use 100 years (in seconds)
                    validitySeconds = config.jwtValiditySeconds;
                }
                let response = yield querier.sendPostRequest(new normalisedURLPath_1.default("/recipe/jwt"), {
                    payload: payload !== null && payload !== void 0 ? payload : {},
                    validity: validitySeconds,
                    algorithm: "RS256",
                    jwksDomain: appInfo.apiDomain.getAsStringDangerous(),
                });
                if (response.status === "OK") {
                    return {
                        status: "OK",
                        jwt: response.jwt,
                    };
                } else {
                    return {
                        status: "UNSUPPORTED_ALGORITHM_ERROR",
                    };
                }
            });
        },
        getJWKS: function () {
            return __awaiter(this, void 0, void 0, function* () {
                return yield querier.sendGetRequest(new normalisedURLPath_1.default("/recipe/jwt/jwks"), {});
            });
        },
    };
}
exports.default = getRecipeInterface;
