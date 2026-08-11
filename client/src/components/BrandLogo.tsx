import logo from "../assets/internmatch-logo.svg";
import icon from "../assets/internmatch-icon.svg";

export const BrandLogo = ({
    variant = "navbar",
    iconOnly = false,
}: {
    variant?: "navbar" | "auth" | "hero";
    iconOnly?: boolean;
}) => (
    <img
        className={`brand-logo brand-logo-${variant}`}
        src={iconOnly ? icon : logo}
        alt="InternMatch"
    />
);
