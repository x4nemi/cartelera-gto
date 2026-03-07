import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { CalendarFilledIcon, CalendarIcon, HeartFilledIcon, Logo, PaletteIcon } from "@/components/icons";
import { siteConfig } from "@/config/site";

export default function HeroPage() {
  return (
    <DefaultLayout>
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center w-full min-h-[80vh] gap-8 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-6 max-w-2xl"
        >
          <Logo size={72} />

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
            Descubre lo que pasa en 
            <span className="text-primary font-semibold font-serif italic"> Guanajuato</span>
          </h1>

          <p className="text-lg md:text-xl text-foreground/70 max-w-lg">
            {siteConfig.description} Talleres, exposiciones y más — todo en un solo lugar, hecho por la comunidad <span className="italic font-serif">cuevanense</span>.
          </p>

          <div className="flex gap-4 mt-4">
            <Button
              as={Link}
              to="/"
              color="primary"
              size="lg"
              radius="full"
              className="font-semibold px-8"
            >
              Explorar eventos
            </Button>
            <Button
              as={Link}
              to="/creacion"
              variant="bordered"
              size="lg"
              radius="full"
              className="font-semibold px-8"
            >
              Publicar evento
            </Button>
          </div>
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-3xl"
        >
          <FeatureCard
            icon={<CalendarFilledIcon size={30}/>}
            title="Eventos locales"
            description="Encuentra actividades creadas por emprendimientos y colectivos de Guanajuato capital."
          />
          <FeatureCard
            icon={<PaletteIcon size={30} />}
            title="Talleres y cultura"
            description="Desde crochet hasta cerámica, descubre talleres artísticos y culturales."
          />
          <FeatureCard
            icon={<HeartFilledIcon size={30} />}
            title="Publica gratis"
            description="Comparte tus eventos con la comunidad de forma sencilla y gratuita."
          />
        </motion.div>
      </section>
    </DefaultLayout>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-foreground/5 backdrop-blur-sm">
      <span className="text-3xl">{icon}</span>
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      <p className="text-sm text-foreground/60 text-center">{description}</p>
    </div>
  );
}
