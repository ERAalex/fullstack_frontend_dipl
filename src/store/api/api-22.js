import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { updateTokensData, setLogout } from "../auth/authReducer";
import { Cookies } from "react-cookie";

const { VITE_HOST } = import.meta.env;
const cookies = new Cookies();

const BASE_API_URL = `http://${VITE_HOST}/api/v1/`;
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.tokenData.access;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // try to get a new token
    const refresh = cookies.get("refresh");
    const refreshResult = await baseQuery(
      {
        url: "token/refresh",
        method: "POST",
        body: {
          refresh: refresh,
        },
      },
      api,
      extraOptions,
    );
    if (refreshResult.data) {
      // store the new token
      api.dispatch(
        updateTokensData({
          access: refreshResult.data.access,
          status: true,
        }),
      );
      // retry the initial query
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(setLogout());
    }
  }
  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Files"],
  endpoints: (builder) => ({
    getTokens: builder.mutation({
      query: (body) => ({
        url: "token",
        method: "POST",
        body,
      }),
    }),
    addUsers: builder.mutation({
      query: (body) => ({
        url: "user/",
        method: "POST",
        body,
      }),
    }),
    checkUser: builder.mutation({
      query: (body) => ({
        url: "check_user",
        method: "POST",
        body,
      }),
    }),
    updateAccessToken: builder.mutation({
      query: () => {
        const refresh = cookies.get("refresh");
        return {
          url: "token/refresh",
          method: "POST",
          body: {
            refresh: refresh,
          },
        };
      },
    }),
    adminUpdateUsers: builder.mutation({
      query: ({ id, ...data }) => {
        const body = data.data;
        console.log(body);
        return {
          url: `users/${id}/`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    adminGetUsers: builder.query({
      query: () => "users/",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "User", id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),
    adminUserDelete: builder.mutation({
      query: ({ id }) => {
        return {
          url: `user/${id}/`,
          method: "DELETE",
        };
      },
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    adminGetUsersFiles: builder.query({
      query: () => "get_all_files",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Files", id })),
              { type: "Files", id: "LIST" },
            ]
          : [{ type: "Files", id: "LIST" }],
    }),
    getUserFiles: builder.query({
      query: (id) => `get_user_files/${id}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Files", id })),
              { type: "Files", id: "LIST" },
            ]
          : [{ type: "Files", id: "LIST" }],
    }),
    deleteUserFile: builder.mutation({
      query: ({ id }) => {
        return {
          url: `files/${id}/`,
          method: "DELETE",
        };
      },
      invalidatesTags: [{ type: "Files", id: "LIST" }],
    }),
    updateUserFile: builder.mutation({
      query: ({ id, ...data }) => {
        const body = data.updateData;
        return {
          url: `files/${id}/`,
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: [{ type: "Files", id: "LIST" }],
    }),
    getDownloadFile: builder.mutation({
      query: ({ id }) => ({
        url: `create_external_link/${id}/`,
        method: "GET",
      }),
    }),
    addNewFile: builder.mutation({
      query: (data) => {
        const body = data.sendData;
        return {
          url: "files/",
          method: "POST",
          body,
        };
      },
      invalidatesTags: [{ type: "Files", id: "LIST" }],
    }),
  }),
});

export const {
  useGetTokensMutation,
  useAddUsersMutation,
  useCheckUserMutation,
  useUpdateAccessTokenMutation,
  useAdminGetUsersQuery,
  useAdminUpdateUsersMutation,
  useAdminUserDeleteMutation,
  useAdminGetUsersFilesQuery,
  useGetUserFilesQuery,
  useDeleteUserFileMutation,
  useUpdateUserFileMutation,
  useGetDownloadFileMutation,
  useAddNewFileMutation,
} = api;
