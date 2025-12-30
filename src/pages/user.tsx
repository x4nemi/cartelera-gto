import { CheckIcon, FBIcon, GlobeIcon, QuestionIcon, WAIcon } from '@/components/icons';
import { MapInput } from '@/components/map';
import DefaultLayout from '@/layouts/default'
import { Button, Card, CardBody, CardHeader, Form, Input, User, Link, Alert, RadioGroup, Radio, Tooltip } from '@heroui/react';
import { useState } from 'react';

export const UserPage = () => {
    const [errors, setErrors] = useState({})

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.currentTarget));

        if (!data.username) {
            setErrors({ username: "Username is required" });

            return;
        }
    };
    return (
        <DefaultLayout>
            <div className='flex justify-center'>
                <Card className='md:w-lg w-full p-5'>
                    <CardHeader>
                        <h4 className="font-bold text-xl">Crea tu usuario</h4>
                    </CardHeader>
                    <CardBody>
                        <Form
                            className="w-full flex flex-col gap-3"
                            validationErrors={errors}
                            onSubmit={onSubmit}
                        >
                            <label htmlFor="username" className='text-lg'>Tu usuario de Instagram</label>
                            <div className='flex w-full'>
                                <Input
                                    size="lg"
                                    labelPlacement="outside"
                                    name="username"
                                    classNames={{
                                        inputWrapper: "h-12 rounded-r-none",
                                    }}
                                    placeholder="tu_usuario"
                                    startContent={
                                        <div className="pointer-events-none flex items-center">
                                            <span className=" text-xl text-pink-300">@</span>
                                        </div>
                                    }
                                />
                                <Button type="submit" variant="flat" size='lg' className="w-32 h-12 rounded-l-none bg-pink-400 text-white">
                                    Siguiente
                                </Button>
                            </div>
                        </Form>
                        <Card shadow='sm' className='mt-5 rounded-xl'>
                            <Alert hideIcon color="success" description='' title="Usuario encontrado" variant="faded" className='rounded-b-none p-0 pl-4' startContent={<CheckIcon size={15} />} />
                            <CardBody>
                                <User
                                    avatarProps={{
                                        src: "https://avatars.githubusercontent.com/u/30373425?v=4",
                                    }}
                                    description={
                                        <Link isExternal href="https://x.com/jrgarciadev" size="sm" color='foreground'>
                                            @jrgarciadev
                                        </Link>
                                    }
                                    name="Junior Garcia"
                                />
                            </CardBody>
                        </Card>
                        <Form
                            className="w-full flex flex-col gap-3 mt-5"
                        // validationErrors={errors}
                        // onSubmit={onSubmit}
                        >
                            <Alert color='warning' variant='faded' title="Esta información es opcional" description="Sin embargo, para mejor visibilidad, te recomendamos completarla si es que cuentas con esta." className='rounded-xl' />
                            <span>Ubicación del local</span>
                            <MapInput />
                            
                            <div><span>Redes sociales</span></div>
                            <Input
                                label='Facebook'
                                type="text"
                                placeholder='https://www.facebook.com/...'
                                startContent={<FBIcon size={20} className="text-pink-300" />}
                            />
                            <Input
                                label='WhatsApp'
                                type="text"
                                startContent={<div className='flex text-sm text-foreground/80 gap-1'><WAIcon size={20} className="text-pink-300" /> +52</div>}
                            />
                            <Input
                                label='Sitio web'
                                type="text"
                                placeholder='https://www.tu-sitio.com'
                                startContent={<GlobeIcon size={20} className="text-pink-300" />}
                            />
                            <Button type="submit" variant="flat" size='lg' className="w-full h-12 bg-pink-400 text-white mt-3">
                                Guardar información
                            </Button>
                        </Form>
                    </CardBody>
                </Card>
            </div>
        </DefaultLayout>
    )
}
