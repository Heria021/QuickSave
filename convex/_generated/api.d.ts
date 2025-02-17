/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@1.14.0.
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as ShareCollection from "../ShareCollection.js";
import type * as ShareLinks from "../ShareLinks.js";
import type * as contentUpdate from "../contentUpdate.js";
import type * as http from "../http.js";
import type * as linkSaver from "../linkSaver.js";
import type * as user from "../user.js";
import type * as userSearch from "../userSearch.js";
import type * as utils from "../utils.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  ShareCollection: typeof ShareCollection;
  ShareLinks: typeof ShareLinks;
  contentUpdate: typeof contentUpdate;
  http: typeof http;
  linkSaver: typeof linkSaver;
  user: typeof user;
  userSearch: typeof userSearch;
  utils: typeof utils;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
