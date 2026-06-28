import { Portal } from "@/pages/portal";
import DefaultLayout from "@/layouts/default";
import { CosmosAPI } from "@/config/apiClient";
import { setPortalUsername } from "@/config/portalSession";
import { usePortalSession } from "@/hooks/usePortalSession";
import { Form } from "@heroui/react";
import { Card, Link } from "@/compat/heroui";
import { Input } from "@/compat/heroui";
import { Button } from "@/compat/heroui";
import { addToast, CardBody } from "@/compat/heroui";
import { IgIcon, MapPinIcon } from "@/components/icons";
import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Portal subdomain landing page.
 *
 * If a "portal session" exists (an IG username remembered in localStorage),
 * render the existing Portal dashboard for that user.
 *
 * Otherwise, show a minimal sign-in stub: the visitor types their IG
 * username, we hit `getUser`, and:
 *   - approved  → store session + render dashboard
 *   - pending   → toast + invite to wait for approval
 *   - missing   → invite them to register at `/registro`
 *
 * TODO: replace this stub with a real auth provider (Azure AD B2C / Clerk /
 * email magic link) before going to GA. See the "Further considerations"
 * section in `plan-splitDomains.prompt.md`.
 */
export default function PortalHomePage() {
    const sessionUsername = usePortalSession();

    if (sessionUsername) {
        return <Portal />;
    }

    return <PortalSignInStub />;
}

const PortalSignInStub = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmed = username.trim().toLowerCase();
        if (!trimmed) {
            setErrors({ username: "Ingresa tu usuario de Instagram" });
            return;
        }
        if (/[^a-zA-Z0-9._]/.test(trimmed)) {
            setErrors({ username: "El usuario solo puede contener letras, números, puntos y guiones bajos" });
            return;
        }

        setSubmitting(true);
        setErrors({});

        try {
            const user = await CosmosAPI.getUser(trimmed);

            if (!user?.username) {
                addToast({
                    title: "No encontramos tu cuenta",
                    description: `No existe un perfil para @${trimmed}. Regístrate para empezar a publicar.`,
                    color: "warning",
                    timeout: 10000,
                    variant: "flat",
                });
                navigate("/registro");
                return;
            }

            if (user.status === "approved") {
                setPortalUsername(user.username);
                addToast({
                    title: `¡Hola, @${user.username}!`,
                    color: "success",
                    timeout: 5000,
                    variant: "flat",
                });
                return;
            }

            if (user.status === "pending") {
                addToast({
                    title: "Cuenta en revisión",
                    description: `@${user.username} aún está en revisión. Te avisaremos por DM cuando esté aprobada.`,
                    color: "warning",
                    timeout: 12000,
                    variant: "flat",
                });
                return;
            }

            addToast({
                title: "Cuenta no disponible",
                description: "Tu cuenta no está activa. Contáctanos para más detalles.",
                color: "danger",
                timeout: 12000,
                variant: "flat",
            });
        } catch {
            addToast({
                title: "Error al verificar",
                description: "No pudimos verificar tu usuario. Inténtalo de nuevo.",
                color: "danger",
                timeout: 8000,
                variant: "flat",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <DefaultLayout>
            <div className="flex w-full justify-center px-4 py-10 md:py-16">
                <div className="w-full max-w-lg flex flex-col gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="text-center flex flex-col items-center gap-3"
                    >
                        <div className="size-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center">
                            <IgIcon size={24} />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                            Portal de negocios
                        </h1>
                        <p className="text-default-500 text-sm md:text-base max-w-sm">
                            Entra con tu usuario de Instagram para publicar y administrar tus eventos en Cartelera GTO.
                        </p>
                    </motion.div>

                    <Card
                        className="w-full rounded-3xl bg-content1/70 backdrop-blur-md border border-default"
                        shadow="none"
                    >
                        <CardBody className="p-5 md:p-6">
                            <Form
                                className="w-full flex flex-col gap-3"
                                validationErrors={errors}
                                onSubmit={onSubmit}
                            >
                                <label htmlFor="username" className="text-sm font-medium text-default-700">
                                    Tu usuario de Instagram
                                </label>
                                <div className="flex w-full">
                                    <Input
                                        size="lg"
                                        labelPlacement="outside"
                                        name="username"
                                        autoComplete="off"
                                        value={username}
                                        onValueChange={setUsername}
                                        classNames={{
                                            inputWrapper: "h-12 rounded-2xl rounded-r-none",
                                        }}
                                        placeholder="tu_usuario"
                                        startContent={
                                            <span className="text-xl text-primary font-semibold pointer-events-none">@</span>
                                        }
                                        type="search"
                                    />
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        className="min-w-32 h-12 rounded-2xl rounded-l-none font-semibold"
                                        color="accent"
                                        isLoading={submitting}
                                        isIconOnly={submitting}
                                    >
                                        {submitting ? "" : "Entrar"}
                                    </Button>
                                </div>
                                <div className="flex items-start gap-2 text-xs text-default-500 mt-1">
                                    <MapPinIcon size={14} className="text-primary shrink-0 mt-0.5" />
                                    <span>Sólo eventos de Guanajuato. Tu cuenta debe ser pública y estar aprobada.</span>
                                </div>
                            </Form>

                            <div className="mt-5 pt-4 border-t border-default/60 text-center">
                                <p className="text-sm text-default-600">
                                    ¿Aún no tienes cuenta?{" "}
                                    <Link href="/registro" color="accent" className="font-semibold">
                                        Regístrate aquí
                                    </Link>
                                </p>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </DefaultLayout>
    );
};
