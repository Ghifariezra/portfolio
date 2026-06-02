import { memo } from "react";
import { AppsForm } from "./apps-form";

export const RouteComponent = memo(function RouteComponent() {
	return <AppsForm isEditMode={false} />;
});
