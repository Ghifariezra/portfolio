import { memo } from "react";
import { BlogForm } from "./blog-form";

export const RouteComponent = memo(function RouteComponent() {
	return <BlogForm />;
});
