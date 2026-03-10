import { CosmosAPI } from "@/config/apiClient";
import { useProfiles } from "@/hooks/useProfiles";
import DefaultLayout from "@/layouts/default"
import { addToast, Button, Card, User } from "@heroui/react";
import { useState } from "react";

export const Admin = () => {
    const { users, loading, refresh } = useProfiles();

    const [loading2, setLoading2] = useState(false)

    const handleApprove = async (username: string) => {
        const finalUser = {...users.find(u => u.username === username, )!, isApproved: true};
        
        try{
            const result = await CosmosAPI.insertUser(finalUser);
            
            setLoading2(true)

            if(result){
                await refresh();
                addToast({
                    title: "Usuario aprobado",
                    description: `El usuario ${username} ha sido aprobado exitosamente.`,
                    timeout: 5000,
                    variant: "flat",
                    color: "success",
                    size: "lg",
                });
            }
        } catch (err) {
            console.error("Error al aprobar usuario:", err);
            alert(`Error al aprobar el usuario ${username}.`);
        } finally {
            setLoading2(false);
        }

    }
    return (
        <DefaultLayout>
            <section className="w-full justify-center">

                {/* <h1 className="text-2xl font-bold">Usuarios para aprobar</h1> */}
                {loading ? (
                    <p>Cargando usuarios...</p>
                ) : (
                    <ul className="mt-4 space-y-2">
                        {users.map(user => (
                            <Card key={user._id} className="p-4 flex flex-row justify-between gap-5 w-full">
                                <User
                                    name={user.fullName}
                                    description={user.isApproved ? "Aprobado" : "Pendiente"}
                                    avatarProps={{ src: user.profilePicUrl }}
                                />
                                { !user.isApproved &&
                                    <Button color="primary" variant="flat" isLoading={loading2} size="md" onClick={() => handleApprove(user.username)}>Aprobar</Button>
                                }
                            </Card>
                        ))}
                    </ul>
                )}
            </section>
        </DefaultLayout>
    )
}
