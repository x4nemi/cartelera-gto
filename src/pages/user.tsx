import { CheckIcon, ConfettiFilledIcon, IgIcon, MapPinIcon } from '@/components/icons';
import { createUser, updateUser, UserData } from '@/config/apiClient';
import { setPortalUsername } from '@/config/portalSession';
import DefaultLayout from '@/layouts/default'
import { Card, Form, Input, Link } from "@heroui/react";
import { Button } from "@/compat/heroui";
import { addToast, CardBody, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, User } from '@/compat/heroui';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { useState } from 'react';

const Rules = () => (
    <div className='rounded-2xl border border-default bg-content1/60 p-4 mb-3'>
        <p className='text-sm font-semibold mb-2'>Antes de continuar, recuerda:</p>
        <ul className='flex flex-col gap-2'>
            <li className='flex items-start gap-2 text-sm'>
                <CheckIcon className='text-primary shrink-0 mt-0.5' size={16}/>
                <span>Publica únicamente eventos del estado de <strong>Guanajuato</strong>.</span>
            </li>
            <li className='flex items-start gap-2 text-sm'>
                <CheckIcon className='text-primary shrink-0 mt-0.5' size={16}/>
                <span>Tu contenido debe estar dirigido a <strong>público local</strong>, no turístico.</span>
            </li>
            <li className='flex items-start gap-2 text-sm'>
                <CheckIcon className='text-primary shrink-0 mt-0.5' size={16}/>
                <span>Nada que promueva odio, violencia o discriminación.</span>
            </li>
        </ul>
        <p className='text-xs text-default-500 mt-3'>Al continuar aceptas estas reglas. Su incumplimiento puede resultar en la eliminación de tu cuenta.</p>
    </div>
)

export const UserPage = () => {
    //#region Form states and handlers
    const [errorsIg, setErrorsIg] = useState({})
    const [usernameInput, setUsernameInput] = useState("")

    const [validating, setValidating] = useState(false)
    const [isUserFound, setIsUserFound] = useState(false)
    const [isUserCreated, setIsUserCreated] = useState(false)

    const [user, setUser] = useState<UserData | null>(null)

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setValidating(true);

        const data = Object.fromEntries(new FormData(e.currentTarget));

        if (!data.username) {
            setErrorsIg({ username: "El usuario es requerido" });
            setValidating(false);
            return
        }

        // if there is space in the username, return error
        if (/\s/.test(data.username as string)) {
            setErrorsIg({ username: "El usuario no puede contener espacios" });
            setValidating(false);
            return
        }

        // there should not be special characters in the username, only letters, number, dots and underscores
        if (/[^a-zA-Z0-9._]/.test(data.username as string)) {
            setErrorsIg({ username: "El usuario solo puede contener letras, números, puntos y guiones bajos" });
            setValidating(false);
            return
        }

        // there should not be more than 30 characters in the username
        if ((data.username as string).length > 30) {
            setErrorsIg({ username: "El usuario no puede tener más de 30 caracteres" });
            setValidating(false);
            return
        }

        try {
            const run = await createUser(data.username as string);

            if (run) {
                if(run.status === "pending") {
                    addToast({
                        title: "Usuario en revisión",
                        description: `El usuario @${run.username} ya ha sido creado y se encuentra en revisión. Te notificaremos por mensaje directo en Instagram cuando esté aprobado.`,
                        timeout: 20000,
                        variant: "flat",
                        color: "warning",
                        size: "md"
                    });
                    setValidating(false);
                    return;
                }
                if(run.status === "approved") {
                    addToast({
                        title: "Usuario ya creado",
                        description: `El usuario @${run.username} ya ha sido creado y aprobado. Si este es tu usuario, por favor contáctanos para resolver cualquier inconveniente.`,
                        timeout: 20000,
                        variant: "flat",
                        color: "warning",
                        size: "md"
                    });
                    setValidating(false);
                    return;
                }
                setUser(run);
                setIsUserFound(true);
                setErrorsIg({});
                addToast({
                    title: "¡Te encontramos!",
                    description: `Confirmamos el usuario @${run.username}.`,
                    timeout: 8000,
                    variant: "flat",
                    color: "success",
                    size: "md"
                });
            } else {
                addToast({
                    title: "No encontramos ese usuario",
                    description: `Verifica que @${data.username} esté escrito correctamente y que la cuenta sea pública.`,
                    timeout: 15000,
                    variant: "flat",
                    color: "danger",
                    size: "md"
                });
            }
        } catch (error) {
            if(error instanceof Error && error.message.includes("privada")) {
                addToast({
                    title: "Cuenta privada",
                    description: "Tu cuenta de Instagram debe ser pública para continuar.",
                    timeout: 15000,
                    variant: "flat",
                    color: "danger",
                    size: "md"
                });
                setErrorsIg({ username: "La cuenta de Instagram es privada" });
            } else {
                setErrorsIg({ username: "Error al validar usuario" });
            }
        }

        setValidating(false);
    };

    const onCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const userData = {
            ...user,
        } as UserData;

        var userResult: UserData | null = null;
        try {
            userResult = await updateUser(userData);
        } catch {
            addToast({
                title: "Error al crear usuario",
                description: "No se pudo crear el usuario. Inténtalo de nuevo.",
                timeout: 10000,
                variant: "flat",
                color: "danger",
                size: "md"
            });
            return;
        }

        addToast({
            title: "¡Usuario creado!",
            description: `@${userResult?.username} ya forma parte de Cartelera GTO.`,
            timeout: 10000,
            variant: "flat",
            color: "success",
            size: "md"
        });
        if (userResult?.username) {
            // Remember which username this browser claims to be, so the portal
            // dashboard can render without needing a `/:username` URL.
            // TODO: replace with real auth before GA.
            setPortalUsername(userResult.username);
        }
        setIsUserCreated(true);
    }
    //#endregion

    //#region Cancel
    const [openModal, setOpenModal] = useState(false)

    const onCancel = () => {
        if (validating) {
            // cancel request if form is being cancelled during validation
            setValidating(false);
            setErrorsIg({});
            setOpenModal(false);
            return;
        }

        // reset form and states
        setIsUserFound(false);
        setValidating(false);
        setErrorsIg({});
        setOpenModal(false);
    }
    //#endregion

    const heading = isUserCreated
        ? "¡Listo!"
        : isUserFound
            ? "Confirma tu perfil"
            : validating
                ? "Buscando tu cuenta…"
                : "Crea tu usuario";

    const subheading = isUserCreated
        ? "Bienvenidx a la comunidad."
        : isUserFound
            ? "Revisa que sea tu cuenta y acepta las reglas para terminar."
            : validating
                ? "Estamos verificando tu cuenta de Instagram."
                : "Ingresa tu cuenta de Instagram pública para empezar a publicar eventos.";

    return (
        <DefaultLayout>
            <div className="flex w-full justify-center px-4 py-10 md:py-16">
                <div className="w-full max-w-lg flex flex-col gap-6">
                    {/* Hero */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="text-center flex flex-col items-center gap-3"
                    >
                        <div className="size-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center">
                            <IgIcon size={24} />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{heading}</h1>
                        <p className="text-default-500 text-sm md:text-base max-w-sm">{subheading}</p>
                    </motion.div>

                    {/* Card */}
                    <Card
                        className="w-full rounded-3xl bg-content1/70 backdrop-blur-md border border-default"
                        shadow="none"
                    >
                        <CardBody className="p-5 md:p-6">
                            <LayoutGroup>
                                <AnimatePresence mode="wait">
                                    {/* Instagram username form - only visible when user not found */}
                                    {!isUserFound && !validating && (
                                        <motion.div
                                            key="form"
                                            initial={{ opacity: 0, y: -12 }}
                                            animate={{ opacity: 1, y: 0, transition: { type: 'spring', visualDuration: 0.4, bounce: 0.2 } }}
                                            exit={{ opacity: 0, y: 40, scale: 0.97, transition: { duration: 0.3, ease: [0.32, 0, 0.67, 0] } }}
                                        >
                                            <Form
                                                className="w-full flex flex-col gap-3"
                                                validationErrors={errorsIg}
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
                                                        value={usernameInput}
                                                        onValueChange={setUsernameInput}
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
                                                        isLoading={validating}
                                                        isIconOnly={validating}
                                                    >
                                                        {validating ? "" : "Continuar"}
                                                    </Button>
                                                </div>
                                                <div className="flex items-start gap-2 text-xs text-default-500 mt-1">
                                                    <MapPinIcon size={14} className="text-primary shrink-0 mt-0.5" />
                                                    <span>Solo eventos de Guanajuato. Tu cuenta debe ser pública.</span>
                                                </div>
                                            </Form>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Shared layout card: skeleton → user card */}
                                {(validating || isUserFound) && (
                                    <motion.div
                                        layoutId="user-card"
                                        className="w-full"
                                        transition={{ type: 'spring', visualDuration: 0.5, bounce: 0.25 }}
                                    >
                                        <Card shadow="none" className="rounded-2xl mb-3 bg-content2/60 border border-default">
                                            <CardBody className={validating ? "flex justify-center items-center py-5" : "py-4"}>
                                                {validating ? (
                                                    <div className="w-full flex items-center justify-center gap-3">
                                                        <div className="size-12 rounded-full bg-default/30 animate-pulse" />
                                                        <div className="flex flex-col gap-2">
                                                            <div className="h-3 w-32 rounded-lg bg-default/30 animate-pulse" />
                                                            <div className="h-3 w-24 rounded-lg bg-default/30 animate-pulse" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <User
                                                        avatarProps={{
                                                            src: user?.profilePicUrl || "/default-avatar.png",
                                                            size: 'lg'
                                                        }}
                                                        description={
                                                            <Link isExternal href={`https://instagram.com/${user?.username}`} size="sm" className="font-semibold">
                                                                @{user?.username}
                                                            </Link>
                                                        }
                                                        name={user?.fullName || " "}
                                                    />
                                                )}
                                            </CardBody>
                                        </Card>
                                    </motion.div>
                                )}

                                {/* Form that appears below the user card */}
                                <AnimatePresence>
                                    {isUserFound && !validating && !isUserCreated && (
                                        <motion.div
                                            key="details-form"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0, transition: { type: 'spring', visualDuration: 0.5, bounce: 0.2, delay: 0.1 } }}
                                            exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
                                        >
                                            <Rules />
                                            <Form
                                                className="w-full flex flex-col gap-3"
                                                onSubmit={onCreateUser}
                                            >
                                                <div className="flex gap-2 w-full">
                                                    <Button
                                                        variant="tertiary"
                                                        className="h-12 px-6 rounded-2xl text-default-500"
                                                        onPress={() => setOpenModal(true)}
                                                    >
                                                        Cancelar
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        variant="primary"
                                                        size="lg"
                                                        className="flex-1 h-12 rounded-2xl font-semibold"
                                                        color="accent"
                                                    >
                                                        Aceptar y crear usuario
                                                    </Button>
                                                </div>
                                            </Form>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Success state */}
                                <AnimatePresence>
                                    {isUserCreated && (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0, transition: { type: 'spring', visualDuration: 0.5, bounce: 0.25, delay: 0.1 } }}
                                            exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
                                            className="flex flex-col items-center text-center gap-3 py-2"
                                        >
                                            <div className="size-14 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                                                <ConfettiFilledIcon size={28} />
                                            </div>
                                            <p className="font-semibold">¡Tu perfil se creó correctamente!</p>
                                            <p className="text-sm text-default-500 max-w-sm">
                                                Te enviaremos por mensaje directo en Instagram el enlace a tu perfil para que puedas empezar a publicar eventos.
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </LayoutGroup>
                        </CardBody>
                    </Card>
                </div>
            </div>

            <Modal isOpen={openModal} backdrop="blur" onOpenChange={setOpenModal} className="rounded-3xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="gap-1">¿Estás seguro?</ModalHeader>
                            <ModalBody>
                                Si cancelas, se perderán los datos ingresados.
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="tertiary" className="rounded-2xl" onPress={onCancel}>
                                    Sí, cancelar
                                </Button>
                                <Button color="accent" className="rounded-2xl" onPress={onClose}>
                                    No
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </DefaultLayout>
    )
}
