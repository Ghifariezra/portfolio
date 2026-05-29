import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { UpsertUserForm } from "../schemas/user.schema";

interface AuthState {
	isAuthenticated: boolean;
	setIsAuthenticated: (status: boolean) => void;
	profile: UpsertUserForm | undefined;
	setProfile: (profile: UpsertUserForm) => void;
	logout: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			isAuthenticated: false,
			setIsAuthenticated: (status: boolean) => set({ isAuthenticated: status }),
			profile: undefined,
			setProfile: (profile: UpsertUserForm) => set({ profile }),
			logout: () => set({ isAuthenticated: false, profile: undefined }),
		}),
		{
			name: "precision-auth-storage",
			storage: createJSONStorage(() => sessionStorage),
		}
	)
);
