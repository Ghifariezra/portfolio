import type { LoginForm, UpsertUserForm } from "@/lib/schemas/user.schema";
import type { AppResponse } from "@/utils/middleware";
import { BaseService } from "./base.service";

export class UserService extends BaseService {
	private static instance: UserService;

	private constructor() {
		super();
	}

	public static getInstance(): UserService {
		if (!UserService.instance) {
			UserService.instance = new UserService();
		}
		return UserService.instance;
	}

	/**
	 * Cek sesi / Ambil data user saat ini
	 * GET /api/v1/user/me
	 */
	public async getMe(): Promise<AppResponse> {
		return this.api.get<unknown, AppResponse>("/user/me");
	}

	/**
	 * Logout / Hapus sesi (Clear HttpOnly Cookie)
	 * POST /api/v1/user/logout
	 */
	public async logout(): Promise<AppResponse> {
		// Method post tanpa payload
		return this.api.post<unknown, AppResponse>("/user/logout");
	}

	/**
	 * Autentikasi owner (Public)
	 * POST /api/v1/user/login
	 */
	public async login(payload: LoginForm): Promise<
		AppResponse<{
			token: string;
			user: UpsertUserForm;
		}>
	> {
		return this.api.post<
			unknown,
			AppResponse<{ token: string; user: UpsertUserForm }>,
			LoginForm
		>("/user/login", payload);
	}

	/**
	 * Upsert profil user
	 * PUT /api/v1/user
	 */
	public async upsertProfile(payload: UpsertUserForm): Promise<AppResponse> {
		return this.api.put<unknown, AppResponse, UpsertUserForm>("/user", payload);
	}
}

export const userService = UserService.getInstance();
