import { memo } from "react";
import { ProjectForm } from "./project-form";

export const RouteComponent = memo(function RouteComponent() {
	return <ProjectForm isEditMode={false} />;
});