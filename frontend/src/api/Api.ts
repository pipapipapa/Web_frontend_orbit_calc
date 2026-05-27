/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface InternalAppHandlerM2MRequest {
  orbit_id?: number;
  payload_tons?: number;
}

export interface OrbitCalcInternalAppDsUser {
  full_name?: string;
  id?: number;
  login?: string;
  /** 'CLIENT', 'MODERATOR' */
  role?: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Orbit Calculator API
 * @version 1.0
 * @contact
 *
 * Сервис для планирования орбитальных миссий
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags Auth
     * @name LoginCreate
     * @summary Аутентификация пользователя (получение JWT)
     * @request POST:/api/login
     */
    loginCreate: (
      request: Record<string, string>,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, string>, any>({
        path: `/api/login`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name LogoutCreate
     * @summary Выход из системы (Добавление токена в Blacklist Redis)
     * @request POST:/api/logout
     * @secure
     */
    logoutCreate: (params: RequestParams = {}) =>
      this.request<Record<string, string>, any>({
        path: `/api/logout`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает ID черновика и количество услуг в нём.
     *
     * @tags Missions
     * @name MissionList
     * @summary Получить иконку корзины (Черновик)
     * @request GET:/api/mission
     * @secure
     */
    missionList: (params: RequestParams = {}) =>
      this.request<Record<string, any>, any>({
        path: `/api/mission`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Mission-M2M
     * @name MissionOrbitItemsUpdate
     * @summary Изменить этап в черновике (нагрузку или порядок)
     * @request PUT:/api/mission-orbit-items
     * @secure
     */
    missionOrbitItemsUpdate: (
      request: InternalAppHandlerM2MRequest,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, string>, any>({
        path: `/api/mission-orbit-items`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Автоматически находит или создает черновик для текущего пользователя по JWT.
     *
     * @tags Mission-M2M
     * @name MissionOrbitItemsCreate
     * @summary Добавить услугу в черновик
     * @request POST:/api/mission-orbit-items
     * @secure
     */
    missionOrbitItemsCreate: (
      request: InternalAppHandlerM2MRequest,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, string>, any>({
        path: `/api/mission-orbit-items`,
        method: "POST",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Без передачи ID заявки, ищет по активному черновику.
     *
     * @tags Mission-M2M
     * @name MissionOrbitItemsDelete
     * @summary Удалить услугу из заявки
     * @request DELETE:/api/mission-orbit-items
     * @secure
     */
    missionOrbitItemsDelete: (
      request: Record<string, number>,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, string>, any>({
        path: `/api/mission-orbit-items`,
        method: "DELETE",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Клиент видит только свои, модератор - все (кроме DELETED/DRAFT).
     *
     * @tags Missions
     * @name MissionsList
     * @summary Получить список заявок с фильтрацией
     * @request GET:/api/missions
     * @secure
     */
    missionsList: (
      query?: {
        /** Фильтр по статусу (FORMED, COMPLETED) */
        status?: string;
        /** Дата от (YYYY-MM-DD) */
        date_from?: string;
        /** Дата до (YYYY-MM-DD) */
        date_to?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, any>({
        path: `/api/missions`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Missions
     * @name MissionsDetail
     * @summary Получить заявку и её состав
     * @request GET:/api/missions/{id}
     * @secure
     */
    missionsDetail: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, any>({
        path: `/api/missions/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Missions
     * @name MissionsUpdate
     * @summary Обновить массу спутника в заявке
     * @request PUT:/api/missions/{id}
     * @secure
     */
    missionsUpdate: (
      id: number,
      request: Record<string, number>,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, string>, any>({
        path: `/api/missions/${id}`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Missions
     * @name MissionsDelete
     * @summary Удалить заявку (SQL UPDATE)
     * @request DELETE:/api/missions/{id}
     * @secure
     */
    missionsDelete: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, string>, any>({
        path: `/api/missions/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Missions
     * @name MissionsCompleteUpdate
     * @summary Завершить/Отклонить заявку (ТОЛЬКО МОДЕРАТОР)
     * @request PUT:/api/missions/{id}/complete
     * @secure
     */
    missionsCompleteUpdate: (
      id: number,
      request: Record<string, string>,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, string>, any>({
        path: `/api/missions/${id}/complete`,
        method: "PUT",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Missions
     * @name MissionsFormUpdate
     * @summary Сформировать заявку (Переход из DRAFT в FORMED и расчеты)
     * @request PUT:/api/missions/{id}/form
     * @secure
     */
    missionsFormUpdate: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, string>, any>({
        path: `/api/missions/${id}/form`,
        method: "PUT",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Доступно всем (Гость). Возвращает список активных орбит.
     *
     * @tags Orbits
     * @name OrbitsList
     * @summary Получить список услуг (орбит)
     * @request GET:/api/orbits
     */
    orbitsList: (
      query?: {
        /** Фильтр по названию */
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, any>({
        path: `/api/orbits`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Orbits
     * @name OrbitsCreate
     * @summary Добавить новую орбиту (ТОЛЬКО МОДЕРАТОР)
     * @request POST:/api/orbits
     * @secure
     */
    orbitsCreate: (
      data: {
        /** Название */
        name: string;
        /** Описание */
        description: string;
        /** Высота орбиты (км) */
        altitude_km: number;
        /**
         * Изображение
         * @format binary
         */
        image?: File;
        /**
         * Видео
         * @format binary
         */
        video?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, any>({
        path: `/api/orbits`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Доступно всем (Гость).
     *
     * @tags Orbits
     * @name OrbitsDetail
     * @summary Детальная информация об орбите
     * @request GET:/api/orbits/{id}
     */
    orbitsDetail: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, any>({
        path: `/api/orbits/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name RegisterCreate
     * @summary Регистрация нового пользователя
     * @request POST:/api/register
     */
    registerCreate: (
      request: OrbitCalcInternalAppDsUser,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, string>, any>({
        path: `/api/register`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
