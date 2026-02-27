import { ConfettiFilledIcon, FBIcon, GlobeIcon, WAIcon } from '@/components/icons';
import { createUser, updateUser, UserData } from '@/config/apiClient';
import DefaultLayout from '@/layouts/default'
import { Button, Card, CardBody, CardHeader, Form, Input, User, Link, Alert, Skeleton, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, addToast } from '@heroui/react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { useState } from 'react';


export const UserPage = () => {
    //#region Form states and handlers
    const [errorsIg, setErrorsIg] = useState({})
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

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

        try {
            const run = await createUser(data.username as string);

            if (run) {
                setUser(run);
                setIsUserFound(true);
                setErrorsIg({});
                addToast({
                    title: "Usuario encontrado",
                    description: `Hemos encontrado el usuario @${run.username}.`,
                    timeout: 10000,
                    variant: "flat",
                    color: "success",
                    size: "md"
                });
            } else {
                setErrorsIg({ username: "Usuario no encontrado" });
            }
        } catch (error) {
            console.error('Error validating Instagram user:', error);
            setErrorsIg({ username: "Error al validar usuario" });
        }

        setValidating(false);
    };

    const onCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setErrors({});

        const data = Object.fromEntries(new FormData(e.currentTarget));
        const { facebook, whatsapp, website } = data;

        // validate fb link
        const patterns = {
            facebook: /^(https?:\/\/)?(www\.)?facebook\.com\/[A-Za-z0-9_.-]+\/?$/,
            whatsapp: /^\d{10}$/,
            website: /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/
        };

        const newErrors: { [key: string]: string } = {};

        if (facebook && facebook !== "" && !patterns.facebook.test(facebook as string)) {
            newErrors.facebook = "Enlace de Facebook inválido";
        }

        if (whatsapp && whatsapp !== "" && !patterns.whatsapp.test(whatsapp as string)) {
            newErrors.whatsapp = "Número de WhatsApp inválido (10 dígitos)";
        }

        if (website && website !== "" && !patterns.website.test(website as string)) {
            newErrors.website = "Enlace de sitio web inválido";
        }

        newErrors && setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        const socialLinks = [];

        if (facebook) {
            socialLinks.push({ type: "facebook", url: facebook as string });
        }
        if (whatsapp) {
            socialLinks.push({ type: "whatsapp", url: `https://wa.me/52${whatsapp}` });
        }
        if (website) {
            socialLinks.push({ type: "website", url: website as string });
        }

        const userData = {
            ...user,
            socialLinks
        } as UserData;

        var userResult: UserData | null = null;
        try {
            userResult = await updateUser(userData);
        } catch (error) {
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
            title: "Usuario creado",
            description: `El usuario @${userResult?.username} ha sido creado exitosamente.`,
            timeout: 10000,
            variant: "flat",
            color: "success",
            size: "md"
        });
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
        setErrors({});
        setErrorsIg({});
        setOpenModal(false);
    }
    //#endregion

    return (
        <DefaultLayout>
            <div className={`flex w-full justify-center items-center ${!isUserFound ? "min-h-[70vh] px-4 py-8" : "mt-20"} transition-all duration-300`}>
                <Card className='md:w-lg w-full mx-2 p-5 max-md:p-1 -mt-10 rounded-3xl bg-content2/70 backdrop-blur-md transition-all duration-250' shadow='none'>
                    <CardHeader>
                        <h4 className="font-bold text-xl">Crea tu usuario</h4>
                    </CardHeader>
                    <CardBody>
                        <LayoutGroup>
                            <AnimatePresence mode="wait">
                                {/* Instagram username form - only visible when user not found */}
                                {!isUserFound && !validating && (
                                    <motion.div
                                        key="form"
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0, transition: { type: 'spring', visualDuration: 0.4, bounce: 0.2 } }}
                                        exit={{ opacity: 0, y: 60, scale: 0.95, transition: { duration: 0.35, ease: [0.32, 0, 0.67, 0] } }}
                                    >
                                        <Form
                                            className={`w-full flex flex-col gap-3`}
                                            validationErrors={errorsIg}
                                            onSubmit={onSubmit}
                                        >
                                            <label htmlFor="username" className='text-lg'>Tu usuario de Instagram</label>
                                            <div className='flex w-full'>
                                                <Input
                                                    size="lg"
                                                    labelPlacement="outside"
                                                    name="username"
                                                    autoComplete="off"
                                                    classNames={{
                                                        inputWrapper: "h-12 rounded-2xl rounded-r-none",
                                                    }}
                                                    placeholder="tu_usuario"
                                                    startContent={
                                                        <div className="pointer-events-none flex items-center">
                                                            <span className=" text-xl text-primary">@</span>
                                                        </div>
                                                    }
                                                />
                                                <Button type="submit" variant="flat" size='lg' className="w-min-32 h-12 rounded-l-none" color="primary" isLoading={validating} isIconOnly={validating}>
                                                    {validating ? "" : "Siguiente"}
                                                </Button>
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
                                    <Card shadow='none' className='rounded-2xl mb-3'>
                                        <CardBody className={validating ? "flex justify-center items-center py-5" : ""}>
                                            {validating ? (
                                                <div className="w-xs flex items-center justify-center gap-3">
                                                    <div>
                                                        <Skeleton className="flex rounded-full w-12 h-12" />
                                                    </div>
                                                    <div className="w-30 flex flex-col gap-2 mr-0">
                                                        <Skeleton className="h-3 w-30 rounded-lg" />
                                                        <Skeleton className="h-3 w-24 rounded-lg" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <User
                                                    avatarProps={{
                                                        src: user?.profilePicUrl || "/default-avatar.png",
                                                        size: 'lg'
                                                    }}
                                                    description={
                                                        <Link isExternal href={`https://instagram.com/${user?.username}`} size="sm" className='font-semibold'>
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
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0, transition: { type: 'spring', visualDuration: 0.5, bounce: 0.2, delay: 0.15 } }}
                                        exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
                                    >
                                        <Form
                                            className="w-full flex flex-col gap-3"
                                            validationErrors={errors}
                                            onSubmit={onCreateUser}
                                        >
                                            <div><span>Redes sociales</span></div>
                                            <Input
                                                name='facebook'
                                                label='Facebook'
                                                type="text"
                                                isClearable
                                                placeholder='https://www.facebook.com/...'
                                                classNames={{ inputWrapper: "rounded-2xl" }}
                                                startContent={<FBIcon size={20} className="text-primary" />}
                                            />
                                            <Input
                                                name="whatsapp"
                                                label='WhatsApp'
                                                type="tel"
                                                isClearable
                                                maxLength={10}
                                                classNames={{ inputWrapper: "rounded-2xl" }}
                                                startContent={<div className='flex text-sm text-foreground/80 gap-1'><WAIcon size={20} className="text-primary" /> +52</div>}
                                            />
                                            <Input
                                                name="website"
                                                label='Sitio web'
                                                type="text"
                                                isClearable
                                                placeholder='https://www.tu-sitio.com'
                                                classNames={{ inputWrapper: "rounded-2xl" }}
                                                startContent={<GlobeIcon size={20} className="text-primary" />}
                                            />
                                            <Alert color='warning' variant='faded' title="Esta información es opcional" description="Sin embargo, para mejor visibilidad, te recomendamos completarla si es que cuentas con esta." className='rounded-2xl' classNames={{ iconWrapper: "animate-bounce" }} />
                                            <div className='flex gap-3 w-full'>
                                                <Button color="danger" variant='bordered' className='h-12 px-8 rounded-2xl' onPress={() => setOpenModal(true)}>Cancelar</Button>
                                                <Button type="submit" variant="flat" size='lg' className="w-full h-12 rounded-2xl" color='primary'>
                                                    Crear usuario
                                                </Button>
                                            </div>
                                        </Form>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Form that appears below the user card */}
                            <AnimatePresence>
                                {isUserCreated && (
                                    <motion.div
                                        key="details-form"
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0, transition: { type: 'spring', visualDuration: 0.5, bounce: 0.2, delay: 0.15 } }}
                                        exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
                                    >
                                        <Alert color='primary' variant='faded' title={<><ConfettiFilledIcon size={30} className="text-primary" />
                                            Tu perfil se creó correctamente, ¿ahora qué sigue?
                                        </>
                                        } description={`Te llegará un link a tu perfil de Instagram para que puedas empezar a publicar eventos.`} className='rounded-2xl' classNames={{ title: "font-semibold flex gap-3 items-center", base:"py-3 px-2" }} hideIcon />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </LayoutGroup>
                    </CardBody>
                </Card>
            </div>

            <Modal isOpen={openModal} backdrop='blur' onOpenChange={setOpenModal} className='rounded-3xl'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="gap-1">¿Estás seguro?</ModalHeader>
                            <ModalBody>
                                Si cancelas, se perderán los datos ingresados.
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" className='rounded-2xl' onPress={onCancel}>
                                    Sí, cancelar
                                </Button>
                                <Button color="primary" className='rounded-2xl' onPress={onClose}>
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
