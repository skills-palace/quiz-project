import axiosApi from "@/lib/axiosApi";

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: "" }) =>
  async ({ url, method, body, params }) => {
    try {
      const response = await axiosApi({
        url: baseUrl + url,
        method,
        data: body,
        params,
      });
      return { data: response.data };
    } catch (err) {
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data,
        },
      };
    }
  };

export default axiosBaseQuery;
