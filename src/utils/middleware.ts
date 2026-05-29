import axios, {
	type AxiosError,
	type AxiosInstance,
	type AxiosResponse,
	type InternalAxiosRequestConfig,
} from "axios";

export interface AppResponse<T = unknown> {
	success: boolean;
	data?: T;
	error?: string;
}

export const apiClient: AxiosInstance = axios.create({
	// Jika di lokal (dev), gunakan "/api/v1" agar masuk proxy.
	// Jika di production, baru pakai VITE_API_URL.
	baseURL: import.meta.env.DEV ? "/api/v1" : import.meta.env.VITE_API_URL,
	headers: { "Content-Type": "application/json" },
	withCredentials: true,
});

// Request Interceptor — tidak perlu inject token manual,
// browser otomatis sertakan HttpOnly Cookie karena withCredentials: true
apiClient.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => config,
	(error: AxiosError) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
	(response: AxiosResponse<AppResponse>) => response.data as any,
	(error: AxiosError<AppResponse>) => {
		if (error.response?.data) {
			return Promise.reject(error.response.data);
		}
		return Promise.reject({
			success: false,
			error: error.message || "An unexpected error occurred",
		});
	}
);
