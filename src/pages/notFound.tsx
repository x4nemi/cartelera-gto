import DefaultLayout from "@/layouts/default";
import { NervousIcon } from "@/components/icons";

export default function NotFoundPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col w-full items-center justify-center h-[calc(100vh-80px)] gap-4 text-foreground/50">
        <NervousIcon size={80} />
        <h1 className="text-4xl font-bold text-foreground">404</h1>
        <p className="text-lg">Página no encontrada</p>
      </section>
    </DefaultLayout>
  );
}
