"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface WithAuthProps {
  allowedRoles?: string[];
}

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  { allowedRoles = [] }: WithAuthProps = {}
): React.FC<P> => {
  const ComponentWithAuth: React.FC<P> = (props) => {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
      const token = sessionStorage.getItem("token");
      const userRole = sessionStorage.getItem("role");

      if (!token) {
        router.push("/login");
        return;
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(userRole || "")) {
        if (userRole === "admin") {
          router.push("/admin/dasboard");
        } 
            if (userRole === "Employee") {
          router.push("/Employee/dasboard");
        }
        else {
          router.push("/");
        }
        return;
      }

      setIsAuthorized(true);
    }, [router]);

    return isAuthorized ? <WrappedComponent {...props} /> : null;
  };

  ComponentWithAuth.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return ComponentWithAuth;
};

export default withAuth;