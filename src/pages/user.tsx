import { CheckIcon } from '@/components/icons';
import DefaultLayout from '@/layouts/default'
import { Button, Card, CardBody, CardHeader, Form, Input, User, Link, Divider, Alert } from '@heroui/react';
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
            <div className='flex w-full justify-center'>
                <Card className='p-5 md:w-lg w-full'>
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
                                            <span className="text-small text-pink-300">@</span>
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
                                        <Link isExternal href="https://x.com/jrgarciadev" size="sm">
                                            @jrgarciadev
                                        </Link>
                                    }
                                    name="Junior Garcia"
                                />
                            </CardBody>
                        </Card>
                    </CardBody>
                </Card>
            </div>
        </DefaultLayout>
    )
}
