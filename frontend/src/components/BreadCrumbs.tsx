import type { FC } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../Routes";

interface Crumb {
    label: string;
    path?: string;
}

interface Props {
    crumbs: Crumb[];
}

export const BreadCrumbs: FC<Props> = ({ crumbs }) => {
    return (
        <ul style={{ listStyle: "none", display: "flex", gap: "10px", padding: "10px 0" }}>
            <li><Link to={ROUTES.HOME}>Главная</Link></li>
            {crumbs.length > 0 &&
                crumbs.map((crumb, index) => (
                    <li key={index} style={{ display: "flex", gap: "10px" }}>
                        <span>/</span>
                        {index === crumbs.length - 1 ? (
                            <span style={{ color: "gray" }}>{crumb.label}</span>
                        ) : (
                            <Link to={crumb.path || ""}>{crumb.label}</Link>
                        )}
                    </li>
                ))}
        </ul>
    );
};